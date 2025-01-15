import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AtividadeService } from '../services/atividades.service';
import { HeaderComponent } from '../../../components/header/header.component';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { ClienteService } from '../../clientes/services/cliente.service';
import { AtividadeCreate } from '../../../shared/types/atividade.types';


@Component({
  selector: 'app-incluiratividades',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ],
  templateUrl: './incluiratividades.component.html',
  styleUrl: './incluiratividades.component.css'
})
export class IncluirAtividadesComponent implements OnInit {
  form!: FormGroup;
  clienteId: number | null = null;
  clienteNome: string = '';
  loading: boolean = false;
  feedback: { tipo: string; mensagem: string } | null = null;
  tiposAtividade = [
    { value: '17', label: 'Acompanhar' },
    { value: '18', label: 'Acompanhar Cotação' },
    { value: '27', label: 'Alteração' },
    { value: '9', label: 'Apresentar cotação' },
    { value: '29', label: 'Carta de Nomeação' },
    { value: '11', label: 'Certificado' },
    { value: '5', label: 'Contato' },
    { value: '16', label: 'Email enviado' },
    { value: '7', label: 'Enviar apresentação' },
    { value: '3', label: 'Enviar email' },
    { value: '4', label: 'Enviar Fax' },
    { value: '26', label: 'Exclusão' },
    { value: '28', label: 'Faturamento' },
    { value: '19', label: 'Feedback' },
    { value: '25', label: 'Inclusão' },
    { value: '15', label: 'Indicação' },
    { value: '10', label: 'Ligação' },
    { value: '20', label: 'Outros' },
    { value: '8', label: 'Preparar Proposta' },
    { value: '24', label: 'Reclamação' },
    { value: '14', label: 'Renovação outro corretor' },
    { value: '6', label: 'Retornar Contato' },
    { value: '21', label: 'Reunião Agendada' },
    { value: '22', label: 'Reunião Realizada' },
    { value: '13', label: 'Seguro Novo' },
    { value: '12', label: 'Sinistro' },
    { value: '2', label: 'Telefonar para' },
    { value: '1', label: 'Visita agendada' },
    { value: '23', label: 'WhatsApp' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private atividadeService: AtividadeService,
    private clienteService: ClienteService
  ) {
    this.inicializarFormulario();
  }

  private inicializarFormulario() {
    const dataAtual = new Date().toLocaleString('pt-BR', { 
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    this.form = this.fb.group({
      tipo: ['', Validators.required],
      referente: [{ value: 'CL', disabled: true }],
      assunto: ['', Validators.required],
      data: [dataAtual, Validators.required],
      hora: ['00:00'],
      local: [''],
      descricao: [''],
      status: ['N'],
      concluida: ['N'],
      dtConclusao: [undefined],
      recorrente: ['N'],
      responsavel: [''],
      resultado: [''],
      cliente: [''],
      oportunidade: [''],
      departamento: ['']
    });
  }

  novaAtividade(event: Event) {
    event.preventDefault();

    if (this.clienteId) {
      this.router.navigate(['/atividades/incluir'], {
        queryParams: {
          clienteId: this.clienteId
        }
      });
    }
  }

  buscarDadosCliente() {
    if (!this.clienteId) return;

    this.loading = true;
    this.clienteService.obterClientePorId(this.clienteId).subscribe({
      next: (response) => {
        console.log('Dados do cliente:', response);
        if (response?.data) {
          this.clienteNome = response.data.nome;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar dados do cliente:', error);
        this.clienteNome = 'Cliente não encontrado';
        this.loading = false;
      }
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log('Query Params:', params); // Para debug
      if (params['clienteId']) {
        this.clienteId = +params['clienteId'];
        this.carregarDadosCliente(this.clienteId);
      }
    });

    this.form.get('concluida')?.valueChanges.subscribe(value => {
      const dtConclusaoControl = this.form.get('dtConclusao');
      if (value === 'S') {
        dtConclusaoControl?.enable();
        dtConclusaoControl?.setValidators([Validators.required]);
      } else {
        dtConclusaoControl?.disable();
        dtConclusaoControl?.clearValidators();
        dtConclusaoControl?.setValue(null);
      }
      dtConclusaoControl?.updateValueAndValidity();
    });
  }

  carregarDadosCliente(id: number) {
    this.clienteService.obterClientePorId(id).subscribe({
      next: (response) => {
        if (response?.data) {
          this.clienteNome = response.data.nome || 'Cliente não encontrado';
        }
      },
      error: (error) => {
        console.error('Erro ao carregar cliente:', error);
        this.clienteNome = 'Erro ao carregar cliente';
      }
    });
  }

  onsubmit() {
    if (this.form.valid && this.clienteId) {
        const formValues = this.form.getRawValue();
        
        const dadosAtividade: AtividadeCreate = {
            clienteId: Number(this.clienteId),
            tipo: formValues.tipo,
            referente: formValues.referente || 'CL',
            assunto: formValues.assunto,
            data: new Date(formValues.data),
            hora: formValues.hora || '00:00',
            local: formValues.local || '',
            descricao: formValues.descricao || '',
            status: formValues.status || 'N',
            concluida: formValues.concluida || 'N',
            dtConclusao: formValues.concluida === 'S' && formValues.dtConclusao
                ? new Date(formValues.dtConclusao)
                : undefined,
            recorrente: formValues.recorrente || 'N',
            responsavel: formValues.responsavel || 'USUARIO_PADRAO',
            resultado: formValues.resultado || '',
            criadoPor: 'SISTEMA',
            oportunidade: '',
            departamento: ''
        };

        this.loading = true;
        this.atividadeService.criarAtividade(dadosAtividade).subscribe({
            next: (response) => {
                console.log('Atividade criada com sucesso:', response);
                this.loading = false;
                
                // Navegando para o dashboard do cliente correto
                this.router.navigate(['/clientes/dash', this.clienteId]);
            },
            error: (error) => {
                console.error('Erro ao criar atividade:', error);
                this.loading = false;
                this.feedback = {
                    tipo: 'error',
                    mensagem: 'Erro ao criar atividade. Por favor, tente novamente.'
                };
            }
        });
    }
}

  voltar() {
    if (this.clienteId) {
      this.router.navigate(['/clientes/dash', this.clienteId]);
    } else {
      this.router.navigate(['/clientes']);
    }
  }
}
