import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, of as observableOf, merge, EMPTY } from 'rxjs';
import { startWith, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { HeaderComponent } from '../../../components/header/header.component';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { Seguradora } from '../../../models/seguradora.model';
import { Ramo } from '../../../models/ramo.model';
import { Produto } from '../../../models/produto.model';
import { SeguradoraService } from '@/app/features/propostas/services/seguradora.service';
import { RamoService } from '../../../features/propostas/services/ramo.service';
import { ProdutoService } from '../../../features/propostas/services/produto.service';
import { ICliente } from '@/backend/src/shared/types/cliente.types';
import { ClienteService } from '@/app/features/propostas/services/cliente.service';
import { PropostaService } from '../services/proposta.service';

interface Parcela {
  numero: number;
  formaPagamento: string;
  vencimento: Date;
  valorParcela: number;
  dataQuitacao: Date;
  valorQuitado: number;
}

interface Agent {
  code: string;
  name: string;
  indirect: boolean;
  participation: number;
  totalTransfers: number;
}

@Component({
  selector: 'app-incluirproposta',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSnackBarModule,
    CurrencyMaskModule,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    NgxMaskDirective
  ],
  providers: [provideNgxMask(), PropostaService],
  templateUrl: './incluirproposta.component.html',
  styleUrls: ['./incluirproposta.component.css']
})
export class IncluirPropostaComponent implements OnInit {
  form: FormGroup;
  seguradoras: Seguradora[] = [];
  ramos: Ramo[] = [];
  produtos: Produto[] = [];
  isEndosso: boolean = false;
  clientes: ICliente[] = [];
  clientesFiltrados: Observable<ICliente[]> = observableOf([]);
  clienteCtrl = new FormControl<string | ICliente>('');
  pagamentos: Parcela[] = [{
    numero: 1,
    formaPagamento: 'Boleto Bancário',
    vencimento: new Date('2023-11-07'),
    valorParcela: 276.00,
    dataQuitacao: new Date('2023-11-07'),
    valorQuitado: 276.00
  }];
  agents: Agent[] = [{
    code: 'ACM',
    name: 'CORRETORA',
    indirect: false,
    participation: 100.00,
    totalTransfers: 0.00
  }];
  selectedFile: File | null = null;
  selectedCommissionBase = 'corretora';
  baseValue = 2.75;
  percentageValue = 0;
  totalValue = 0;
  selectedTransferType = 'proportional';

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private seguradoraService: SeguradoraService,
    private ramoService: RamoService,
    private produtoService: ProdutoService,
    private propostaService: PropostaService,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      valores: this.fb.array([
        this.fb.control(''),  // Valor Líquido
        this.fb.control(''),  // Adicional
        this.fb.control(''),  // Desconto (subtraído)
        this.fb.control(''),  // Custo Apólice
        this.fb.control(''),  // IOF
        this.fb.control('')   // Total (calculado)
      ]),
      comissaoBase: this.fb.control({ value: '', disabled: false }),
      percentualComissao: this.fb.control(null),
      valorComissao: this.fb.control({ value: '', disabled: true }),
      numeroParcelas: ['', [Validators.required, Validators.min(1)]],
      primeiraParcela: [{ value: '', disabled: true }]
    });

    this.setupClienteAutocomplete();
    this.setupValueSynchronization();
    this.setupCommissionCalculation();
  }

  salvarProposta(): void {
    if (this.form.invalid) {
      console.log('Erros do formulário:', this.form.errors);
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control?.errors) {
          console.log(`Campo ${key}:`, control.errors);
        }
      });
      this.snackBar.open('Preencha todos os campos obrigatórios', 'Fechar', { duration: 3000 });
      return;
    }

    const formValue = this.form.getRawValue();
    const proposta = {
      numero: formValue.numeroProposta,
      tipoDocumento: formValue.tipoDocumento,
      motivoEndosso: formValue.motivoEndosso || '',
      dataProposta: this.formatarData(formValue.dataProposta),
      vigenciaInicio: this.formatarData(formValue.vigenciaInicio),
      vigenciaFim: this.formatarData(formValue.vigenciaFim),
      clienteId: Number(formValue.clienteId),
      seguradoraId: Number(formValue.seguradoraId),
      produtoId: Number(formValue.produtoId),
      ramoId: Number(formValue.ramoId),
      formaPagamento: formValue.formaPagamento,
      numeroParcelas: Number(formValue.numeroParcelas),
      vencimentoPrimeira: this.formatarData(formValue.dataProposta),
      valorPrimeira: Number(this.valores.at(0).value),
      premioLiquido: Number(this.valores.at(0).value),
      adicional: Number(this.valores.at(1).value),
      desconto: Number(this.valores.at(2).value),
      custoApolice: Number(this.valores.at(3).value),
      iof: Number(this.valores.at(4).value),
      premioTotal: Number(this.valores.at(5).value),
      comissaoBase: Number(formValue.comissaoBase),
      comissaoPercentual: Number(formValue.percentualComissao),
      comissaoValor: Number(formValue.valorComissao),
      status: 'Aguardando Emissão',
      criadoPor: 'SISTEMA'
    };

    this.propostaService.criar(proposta).subscribe({
      next: (response) => {
        this.snackBar.open('Proposta salva com sucesso!', 'Fechar', { duration: 3000 });
      },
      error: (error) => {
        console.error('Erro ao salvar:', error);
        this.snackBar.open('Erro ao salvar proposta', 'Fechar', { duration: 3000 });
      }
    });
  }

  private formatarData(data: string): Date {
    if (!data) return new Date();
    const [dia, mes, ano] = data.split('/');
    return new Date(Number(ano), Number(mes) - 1, Number(dia));
  }

  carregarProposta(id: number): void {
    this.propostaService.buscarPorId(id).subscribe({
      next: (proposta) => {
        // Populate form with proposta data
        this.form.patchValue({
          numeroProposta: proposta.numero,
          tipoDocumento: proposta.tipoDocumento,
          motivoEndosso: proposta.motivoEndosso,
          dataProposta: proposta.dataProposta,
          vigenciaInicio: proposta.vigenciaInicio,
          vigenciaFim: proposta.vigenciaFim,
          seguradoraId: proposta.seguradoraId,
          ramoId: proposta.ramoId,
          produtoId: proposta.produtoId,
          formaPagamento: proposta.formaPagamento,
          numeroParcelas: proposta.numeroParcelas,
          // ... populate other fields
        });

        // Update valores FormArray
        this.valores.at(0).setValue(proposta.premioLiquido);
        this.valores.at(1).setValue(proposta.adicional);
        this.valores.at(2).setValue(proposta.desconto);
        this.valores.at(3).setValue(proposta.custoApolice);
        this.valores.at(4).setValue(proposta.iof);
        this.valores.at(5).setValue(proposta.premioTotal);
      },
      error: (error) => {
        console.error('Erro ao carregar proposta:', error);
        this.snackBar.open('Erro ao carregar proposta', 'Fechar', {
          duration: 4000
        });
      }
    });
  }

  ngOnInit() {
    this.initForm();
    this.loadSeguradoras();
    this.loadRamos();
    this.valores.valueChanges.pipe(
      debounceTime(100)
    ).subscribe(() => {
      this.calculateTotal();
    });

    // Atualização das parcelas
    this.form.get('numeroParcelas')?.valueChanges.pipe(
      debounceTime(100)
    ).subscribe(() => this.calcularParcela());

    this.valores.at(5).valueChanges.pipe(
      debounceTime(100)
    ).subscribe(() => this.calcularParcela());
  }

  get valores(): FormArray {
    return this.form.get('valores') as FormArray;
  }

  getLabel(index: number): string {
    const labels = ['Prêmio Líquido', 'Adicional', 'Desconto', 'Custo Apólice', 'IOF', 'Total'];
    return labels[index];
  }


  private initForm(): void {
    this.form.addControl('dataProposta', this.fb.control('', [Validators.required]));
    this.form.addControl('vigenciaInicio', this.fb.control('', [Validators.required]));
    this.form.addControl('vigenciaFim', this.fb.control('', [Validators.required]));
    this.form.addControl('dataEmissao', this.fb.control(''));
    this.form.addControl('tipoDocumento', this.fb.control('', [Validators.required]));
    this.form.addControl('motivoEndosso', this.fb.control({ value: '', disabled: true }));
    this.form.addControl('numeroEndosso', this.fb.control(''));
    this.form.addControl('numeroApolice', this.fb.control(''));
    this.form.addControl('numeroApoliceEndossada', this.fb.control({ value: '', disabled: true }));
    this.form.addControl('seguradoraId', this.fb.control(null, [Validators.required]));
    this.form.addControl('ramoId', this.fb.control(null, [Validators.required]));
    this.form.addControl('produtoId', this.fb.control({ value: null, disabled: true }, [Validators.required]));
    this.form.addControl('nomeCliente', this.fb.control(''));
    this.form.addControl('clienteId', this.fb.control(null, [Validators.required]));
    this.form.addControl('comissaoBase', this.fb.control({ value: '', disabled: true }));
    this.form.addControl('percentualComissao', this.fb.control(null, [Validators.required]));
    this.form.addControl('valorComissao', this.fb.control(null));
    this.form.addControl('formaPagamento', this.fb.control(null, [Validators.required]));
    this.form.addControl('numeroParcelas', this.fb.control(null, [Validators.required]));
    this.form.addControl('numeroProposta', this.fb.control(null, [Validators.required]));


    // Configurar listeners para mudanças nos valores do `FormArray`
    this.valores.controls.forEach((control) => {
      control.valueChanges.subscribe(() => {
        this.calculateTotal();
      });
    });

    // Monitorar valor de `tipoDocumento`
    this.form.get('tipoDocumento')?.valueChanges.subscribe((tipo: string) => {
      this.isEndosso = ['C', 'D', 'I', 'M', 'R', 'X'].includes(tipo);
      const motivoEndosso = this.form.get('motivoEndosso');
      const numeroApoliceEndossada = this.form.get('numeroApoliceEndossada');

      if (this.isEndosso) {
        motivoEndosso?.enable();
        numeroApoliceEndossada?.enable();
      } else {
        motivoEndosso?.disable();
        numeroApoliceEndossada?.disable();
        this.form.patchValue({
          motivoEndosso: '',
          numeroApoliceEndossada: ''
        });
      }
    });

    // Monitorar `ramoId` para carregar produtos
    this.form.get('ramoId')?.valueChanges.subscribe((ramoId: number) => {
      const produtoControl = this.form.get('produtoId');
      if (ramoId && produtoControl) {
        produtoControl.enable();
        this.loadProdutos(ramoId);
      } else {
        produtoControl?.disable();
        this.produtos = [];
        this.form.patchValue({ produtoId: null });
      }
    });

    // Monitorar campos de cálculo
    ['premioLiquido', 'adicional', 'desconto', 'custoApolice', 'iof'].forEach(campo => {
      this.form.get(campo)?.valueChanges.subscribe(() => {
        this.calculateTotal();
      });
    });
  }

  calcularParcela(): void {
    const numeroParcelas = this.form.get('numeroParcelas')?.value || 0;
    const totalPremio = this.valores.at(5).value || 0;

    if (numeroParcelas > 0 && totalPremio > 0) {
      const primeiraParcela = totalPremio / numeroParcelas;
      this.form.get('primeiraParcela')?.setValue(primeiraParcela.toFixed(2));
    }
  }

  private setupClienteAutocomplete() {
    this.clientesFiltrados = this.clienteCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(valor => {
        const nome = typeof valor === 'string' ? valor : valor?.nome;
        return nome ? this.filtrarClientes(nome) : this.clienteService.listarClientesOrdenados();
      })
    );
  }

  private setupValueSynchronization(): void {
    this.valores.at(0).valueChanges.subscribe(totalValue => {
      this.form.get('comissaoBase')?.setValue(totalValue, { emitEvent: false });
    });
  }

  private filtrarClientes(nome: string): Observable<ICliente[]> {
    const valorFormatado = nome.toLowerCase();
    return this.clienteService.buscarClientesPorNome(valorFormatado);
  }

  selecionarCliente(event: MatAutocompleteSelectedEvent): void {
    const cliente = event.option.value as ICliente;
    console.log('Selecionando cliente:', cliente);
    this.form.patchValue({
      nomeCliente: cliente.nome,
      clienteId: cliente.id
    });
    console.log('Form após seleção:', this.form.value);
  }

  displayFn(cliente: any): string {
    return cliente?.nome || cliente || '';
  }

  private async loadSeguradoras(): Promise<void> {
    try {
      this.seguradoras = await this.seguradoraService.listarSeguradoras().toPromise() || [];
    } catch (error) {
      console.error('Erro ao carregar seguradoras:', error);
    }
  }

  private async loadRamos(): Promise<void> {
    try {
      this.ramos = await this.ramoService.listarRamos().toPromise() || [];
    } catch (error) {
      console.error('Erro ao carregar ramos:', error);
    }
  }

  private async loadProdutos(ramoId: number): Promise<void> {
    try {
      this.produtos = await this.produtoService.listarProdutosPorRamo(ramoId).toPromise() || [];
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  }

  calculateTotal() {
    const values = this.valores.getRawValue();
    const total = parseFloat(values[0] || 0) +
      parseFloat(values[1] || 0) +
      parseFloat(values[3] || 0) +
      parseFloat(values[4] || 0) -
      parseFloat(values[2] || 0);

    if (total !== parseFloat(this.valores.at(5).value)) {
      this.valores.at(5).setValue(total.toFixed(2), { emitEvent: false });
    }
  }

  private setupCommissionCalculation(): void {
    this.form.get('comissaoBase')?.valueChanges.subscribe(() => this.calculateCommission());
    this.form.get('percentualComissao')?.valueChanges.subscribe(() => this.calculateCommission());
  }

  private calculateCommission(): void {
    const baseValue = parseFloat(this.form.get('comissaoBase')?.value || 0);
    const commissionRate = parseFloat(this.form.get('percentualComissao')?.value || 0);

    const commissionValue = baseValue * (commissionRate / 100);

    this.form.get('valorComissao')?.setValue(commissionValue.toFixed(2), { emitEvent: false });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.snackBar.open(
        `Arquivo ${this.selectedFile.name} selecionado com sucesso!`,
        'Fechar',
        {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        }
      );
    }
  }
}