import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../components/header/header.component';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CpfCnpjMaskDirective } from '../../../shared/directives/cpf-cnpj-mask.directive';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ClienteService } from '../services/cliente.service';
import { IClienteForm, FORM_OPTIONS } from '../../../../backend/src/shared/types/cliente.types';


@Component({
  selector: 'app-incluirclientes',
  standalone: true,
  imports: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    NgxMaskDirective,
    CpfCnpjMaskDirective,
  ],
  providers: [
    provideNgxMask(),
    ClienteService,
    Router
  ],
  templateUrl: './incluirclientes.component.html',
  styleUrl: './incluirclientes.component.css'
})

export class IncluirclientesComponent implements OnInit {
  formOptions = FORM_OPTIONS;
  form: FormGroup = this.inicializarFormulario();
  feedback: { tipo: string; mensagem: string } | null = null;
  modoEdicao = false;
  clienteId: number | null = null;
  tipoPessoa: string = 'F';
  showPessoaFisica: boolean = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private clienteService: ClienteService,
    private router: Router
  ) { }

  private inicializarFormulario(): FormGroup {
    return this.fb.group({
      id: [''],
      nome: ['', Validators.required],
      nomeSocial: [''],
      tipoPessoa: ['F', Validators.required],
      cnpjCpf: ['', [this.validarCpfCnpj()]],
      status: ['', Validators.required],
      clienteDesde: [''],
      dtInclusao: [{ value: '', disabled: true }],
      dtAlteracao: [{ value: '', disabled: true }],
      email: ['', [Validators.email]],
      site: [''],
      telefone: [''],
      facebook: [''],
      instagram: [''],
      origem: [''],
      responsavel: [''],
      unidadeNegocio: [''],
      faturamento: [''],
      atividade: [''],
      nrFuncionarios: [''],
      dtNascimento: [''],
      sexo: [''],
      rg: [''],
      dtExpedicao: [''],
      emissor: [''],
      cnh: [''],
      emissorCnh: [''],
      dtvencCnh: [''],
      estadoCivil: [''],
      conjuge: [''],
      cep: [''],
      endereco: [''],
      numero: [''],
      complemento: [''],
      bairro: [''],
      cidade: [''],
      estado: [''],
      lgpd: ['S']
    });
  }

  private validarCpfCnpj() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const valor = control.value.replace(/[^\d]/g, '');
      const tipoPessoa = this.form?.get('tipoPessoa')?.value;

      if (tipoPessoa === 'F') {
        return valor.length !== 11 ? { cpfInvalido: true } : null;
      } else {
        return valor.length !== 14 ? { cnpjInvalido: true } : null;
      }
    };
  }

  isFieldInvalid(field: string): boolean {
    const formField = this.form.get(field);
    return formField ? (formField.invalid && (formField.dirty || formField.touched)) : false;
  }

  ngOnInit(): void {
    const dataAtual = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    this.form.patchValue({
      dtInclusao: dataAtual,
      dtAlteracao: dataAtual
    });
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.clienteId = +params['id'];
        this.carregarDadosCliente(this.clienteId);
        this.modoEdicao = true;
      }
    });
  };

  carregarDadosCliente(id: number) {
    this.clienteService.obterClientePorId(id).subscribe({
      next: (response) => {
        if (response?.data) {
          const cliente = response.data;

          // Converter dados do backend para formato do formulário
          const dadosParaForm: IClienteForm = {
            ...cliente,
            tipoPessoa: this.formOptions.tipoPessoa.find(t => t.dbValue === cliente.tipoPessoa)?.value || 'F',
            dtNascimento: this.formatarDataParaForm(cliente.dtNascimento),
            dtExpedicao: this.formatarDataParaForm(cliente.dtExpedicao),
            dtvencCnh: this.formatarDataParaForm(cliente.dtvencCnh),
          };

          this.form.patchValue(dadosParaForm);
        }
      },
      error: (error) => {
        console.error('Erro ao carregar dados do cliente:', error);
        this.feedback = {
          tipo: 'danger',
          mensagem: 'Erro ao carregar dados do cliente. Tente novamente.'
        };
      }
    });
  }

  private formatarDataParaForm(data: string | null): string {
    if (!data) return '';
    try {
      const dataObj = new Date(data);
      return dataObj.toLocaleDateString('pt-BR');
    } catch (error) {
      console.error('Erro ao formatar data:', data, error);
      return '';
    }
  }

  onTipoPessoaChange(event: any): void {
    this.tipoPessoa = event.target.value;
    this.showPessoaFisica = this.tipoPessoa === 'F';
    this.form.get('cnpjCpf')?.setValue('');

    if (!this.showPessoaFisica) {
      this.form.patchValue({
        dtNascimento: '',
        sexo: '',
        rg: '',
        dtExpedicao: '',
        emissor: '',
        cnh: '',
        emissorCnh: '',
        dtvencCnh: '',
        estadoCivil: '',
        conjuge: ''
      });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValues = this.form.value;

      // Função auxiliar para formatar data
      const formatarData = (data: string | null): string | null => {
        if (!data) return null;
        try {
          // Converte data do formato dd/mm/yyyy para yyyy-mm-dd
          const [dia, mes, ano] = data.split('/');
          return `${ano}-${mes}-${dia}`;
        } catch {
          return null;
        }
      };

      const dadosFormatados = {
        ...formValues,
        // Formatação das datas
        dtNascimento: formatarData(formValues.dtNascimento),
        dtExpedicao: formatarData(formValues.dtExpedicao),
        dtvencCnh: formatarData(formValues.dtvencCnh),
        tipoPessoa: FORM_OPTIONS.tipoPessoa.find(t => t.value === formValues.tipoPessoa)?.value || 'F',
        
        sexo: formValues.sexo
          ? FORM_OPTIONS.sexo.find(s => s.value === formValues.sexo)?.value
          : null,
        estadoCivil: formValues.estadoCivil
          ? FORM_OPTIONS.estadocivil.find(e => e.value === formValues.estadoCivil)?.value
          : null,
        origem: formValues.origem
          ? FORM_OPTIONS.origem.find(o => o.value === formValues.origem)?.value
          : null,
        nrFuncionarios: formValues.nrFuncionarios
          ? FORM_OPTIONS.nrFuncionarios.find(n => n.value === formValues.nrFuncionarios)?.value
          : null,
        faturamento: formValues.faturamento
          ? formValues.faturamento.toString()
          : null,
        lgpd: formValues.lgpd || 'S'
      };

      console.log('Dados formatados para envio:', dadosFormatados);

      const request = this.clienteId
        ? this.clienteService.atualizarCliente(this.clienteId, dadosFormatados)
        : this.clienteService.criarCliente(dadosFormatados);

      request.subscribe({
        next: (response: any) => {
          const novoClienteId = response.id || response?.data?.id;

          if (novoClienteId) {
            this.feedback = {
              tipo: 'success',
              mensagem: `Cliente ${this.clienteId ? 'atualizado' : 'criado'} com sucesso!`
            };

            setTimeout(() => {
              this.router.navigate(['/clientes/dash', novoClienteId]);
            }, 1500);
          }
        },
        error: (error) => {
          console.error(`Erro ao ${this.clienteId ? 'atualizar' : 'criar'} cliente:`, error);
          this.feedback = {
            tipo: 'danger',
            mensagem: `Erro ao ${this.clienteId ? 'atualizar' : 'criar'} cliente. Tente novamente.`
          };
        }
      });
    } else {
      console.log('Campos inválidos:',
        Object.keys(this.form.controls)
          .filter(key => this.form.get(key)?.errors)
          .map(key => `${key}: ${JSON.stringify(this.form.get(key)?.errors)}`)
      );

      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });

      this.feedback = {
        tipo: 'danger',
        mensagem: 'Por favor, preencha todos os campos obrigatórios corretamente.'
      };
    }
  }

  voltar
    (): void {
    this.router.navigate(['/clientes']);
  }
}