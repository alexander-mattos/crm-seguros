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
import {
  IClienteForm,
  FORM_OPTIONS,
  TipoPessoa,
  StatusCliente,
  Sexo,
  EstadoCivil,
  NrFuncionarios,
  Origem
} from '../../../../backend/src/shared/types/cliente.types';


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
      // Dados Básicos
      id: [''],
      nome: ['', Validators.required],
      nomeSocial: [''],
      tipoPessoa: ['F', Validators.required],
      cnpjCpf: ['', [this.validarCpfCnpj()]],
      status: ['', Validators.required],
      clienteDesde: [''],
      dtInclusao: [{ value: '', disabled: true }],
      dtAlteracao: [{ value: '', disabled: true }],

      // Contatos e Redes Sociais
      email: ['', [Validators.email]],
      site: [''],
      telefone: [''],
      facebook: [''],
      instagram: [''],

      // Dados Comerciais
      origem: [''],
      responsavel: [''],
      unidadeNegocio: [''],

      // Dados Financeiros
      faturamento: [''],
      atividade: [''],

      // Dados específicos PJ
      nrFuncionarios: [''],

      // Dados específicos PF
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

      // Endereço
      cep: [''],
      endereco: [''],
      numero: [''],
      complemento: [''],
      bairro: [''],
      cidade: [''],
      estado: [''],

      // LGPD
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
            status: this.formOptions.status.find(s => s.dbValue === cliente.status)?.value || '2',
            dtNascimento: this.formatarDataParaForm(cliente.dtNascimento),
            dtExpedicao: this.formatarDataParaForm(cliente.dtExpedicao),
            dtvencCnh: this.formatarDataParaForm(cliente.dtvencCnh),
            // ... outras conversões necessárias
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

        // Resto do mapeamento
        tipoPessoa: FORM_OPTIONS.tipoPessoa.find(t => t.value === formValues.tipoPessoa)?.value || 'F',
        status: FORM_OPTIONS.status.find(s => s.value === formValues.status)?.value || '2',
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

  private mapearStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'CLIENTE': '1',
      'PROSPECT': '2',
      'PARCEIRO': '3',
      'INATIVO': '8',
      'NÃO INFORMADO': '0'
    };
    return statusMap[status] || '2'; // Default para PROSPECT
  }

  private mapearSexo(sexo: string): string | null {
    const sexoMap: { [key: string]: string } = {
      'Masculino': 'M',
      'Feminino': 'F'
    };
    return sexoMap[sexo] || null;
  }

  private mapearEstadoCivil(estadoCivil: string): string | null {
    const estadoCivilMap: { [key: string]: string } = {
      'Casado(a)': '1',
      'Viúvo(a)': '2',
      'Desquitado(a)': '3',
      'Solteiro(a)': '4',
      'Divorciado(a)': '5',
      'Separado(a)': '6',
      'União Estável': '7'
    };
    return estadoCivilMap[estadoCivil] || null;
  }

  private mapearNrFuncionarios(nr: string): string | null {
    const nrFuncionariosMap: { [key: string]: string } = {
      'até 200': '1',
      'de 200 a 500': '2',
      'de 500 a 1000': '3',
      'de 1000 a 3000': '4',
      'de 3000 a 5000': '5',
      '+ de 5000': '6'
    };
    return nrFuncionariosMap[nr] || null;
  }

  private mapearOrigem(origem: string): string | null {
    const origemMap: { [key: string]: string } = {
      'INTERNET': '1',
      'TELEFONE': '2',
      'INDICAÇÃO': '3',
      'ANÚNCIO': '4',
      'INSTAGRAM': '5',
      'FACEBOOK': '6',
      'GOOGLE': '7',
      'OUTROS': '99'
    };
    return origemMap[origem] || null;
  }
}