import { FooterComponent } from '../../../components/footer/footer.component';
import { HeaderComponent } from '../../../components/header/header.component';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { provideNgxMask } from 'ngx-mask';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { ClienteService } from '../services/cliente.service';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { AtividadeService } from '../../atividades/services/atividades.service';
import { Atividade } from '../types/atividade.types';
import { ICliente, IClienteExibicao, FORM_OPTIONS } from '@/backend/src/shared/types/cliente.types';
import { ApiResponse } from '../../../models/api.model';
import { ITelefone, FORMS_OPTIONS, TipoTelefone } from '../../../shared/types/telefone.types';
import { IEndereco, FORM_OPTION, TipoEndereco } from '../../../shared/types/endereco.types';
import { IContato, FORM_OPTIONS_CONTATOS, TipoContato } from '../../../shared/types/contatos.types';
import { TelefoneService } from '../telefoneclientes/services/telefone.service';
import { EnderecoService } from '../enderecoclientes/services/endereco.service';
import { ContatosService } from '../contatosclientes/services/contatos.service';
import { NotasService } from '../dashclientes/services/notas.service';
import { INota } from '../../../shared/types/notas.types';


@Component({
  selector: 'app-dashclientes',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    ReactiveFormsModule,
    RouterModule
  ],
  providers: [
    provideNgxMask(),
    ClienteService
  ],
  templateUrl: './dashclientes.component.html',
  styleUrl: './dashclientes.component.css'
})
export class DashclientesComponent implements OnInit {
  form!: FormGroup;
  cliente: IClienteExibicao | null = null;
  loading = true;
  erro: string | null = null;
  activeTab = 'atividades';
  clienteId: number | null = null;
  atividades: Atividade[] = [];
  mostrarPerfil = false;
  atividadesCliente: Atividade[] = [];
  telefones: ITelefone[] = [];
  enderecos: IEndereco[] = [];
  contatos: IContato[] = [];
  content: INota[] = [];
  formOptions = FORM_OPTIONS;
  formOptionsEnd = FORM_OPTION;

  carregarCliente(id: number) {
    this.loading = true;
    this.erro = null;

    this.clienteService.obterClientePorId(id).subscribe({
      next: (response: ApiResponse<ICliente>) => {
        console.log('Dados do cliente recebidos:', response);
        if (response?.data) {
          const dadosCliente = response.data;
          this.cliente = {
            ...dadosCliente,
            tipoPessoaFormatado: this.formatarTipoPessoa(dadosCliente?.tipoPessoa),
            statusFormatado: this.formatarStatus(dadosCliente?.status),
            sexoFormatado: this.formatarSexo(dadosCliente?.sexo),
            dtNascimentoFormatado: this.formatarData(dadosCliente?.dtNascimento),
            dtExpedicaoFormatado: this.formatarData(dadosCliente?.dtExpedicao),
            dtvencCnhFormatado: this.formatarData(dadosCliente?.dtvencCnh),
            dtInclusaoFormatado: this.formatarData(dadosCliente?.dtInclusao),
            dtAlteracaoFormatado: this.formatarData(dadosCliente?.dtAlteracao),
            clienteDesdeFormatado: this.formatarClienteDesde(dadosCliente?.clienteDesde)
          };
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar dados do cliente:', error);
        this.erro = 'Erro ao carregar dados do cliente. Por favor, tente novamente.';
        this.loading = false;
      }
    });
  }

  private readonly ICONES_ATIVIDADE: Record<string, string> = {
    '1': 'fas fa-calendar-check',          //Visita agendada
    '2': 'fas fa-phone',                   //Telefonar para
    '3': 'fas fa-paper-plane',             //Enviar email
    "4": 'fas fa-fax',                     //Enviar Fax
    '5': 'fas fa-address-book',            //Contato
    "6": 'fas fa-exchange-alt',            //Retornar Contato
    "7": 'fas fa-file-import',             //Enviar apresentação
    "8": 'fas fa-file-contract',           //Preparar Proposta
    "9": 'fas fa-angle-double-right',      //Apresentar cotação
    "10": 'fas fa-phone-volume',           //Ligação
    "11": 'fas fa-certificate',            //Certificado
    "12": 'fas fa-shield-alt',             //Sinistro
    "13": 'fas fa-folder-plus',            //Seguro Novo
    "14": 'fas fa-redo-alt',               //Renovação outro corretor
    "15": 'fas fa-hand-point-right',       //Indicação
    "16": 'fas fa-envelope-open-text',     //Email enviado
    "17": 'fas fa-check',                  //Acompanhar
    "18": 'fas fa-check-double',           //Acompanhar Cotação
    '19': 'fas fa-comment-alt',            //Feedback
    "20": 'fas fa-crop-alt',               //Outros
    '21': 'fas fa-calendar-plus',          //Reunião Agendada
    '22': 'fas fa-handshake',              //Reunião Realizada
    "23": 'fab fa-whatsapp',               //WhatsApp
    "24": 'fas fa-bullhorn',               //Reclamação
    "25": 'fas fa-plus-circle',            //Inclusão
    "26": 'fas fa-minus-circle',           //Exclusão
    "27": 'fas fa-sync',                   //Alteração
    "28": 'fas fa-coins',                  //Faturamento
    "29": 'fas fa-envelope-open-text'      //Carta de Nomeação
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private clienteService: ClienteService,
    private atividadesService: AtividadeService,
    private telefoneService: TelefoneService,
    private enderecoService: EnderecoService,
    private contatosService: ContatosService,
    private notasService: NotasService
  ) {
    this.inicializarFormulario();
  }

  private inicializarFormulario() {
    this.form = this.fb.group({
      content: ['']
    });
  }

  formatarTipoPessoa(tipo: string | null | undefined): string {
    if (!tipo) return 'NÃO INFORMADO';
    const option = this.formOptions.tipoPessoa.find(t => t.value === tipo);
    return option?.label || 'NÃO INFORMADO';
  }

  formatarTipoEndereco(tipo: string | null | undefined): string {
    if (!tipo) return 'NÃO INFORMADO';
    const option = this.formOptionsEnd.tipoEndereco.find(u => u.value === tipo);
    return option?.label || 'NÃO INFORMADO';
  }

  formatarStatus(status: string | null | undefined): string {
    if (!status) return 'NÃO INFORMADO';
    const option = this.formOptions.status.find(s => s.value === status);
    return option?.label || 'NÃO INFORMADO';
  }

  formatarSexo(sexo: string | null | undefined): string {
    if (!sexo) return 'NÃO INFORMADO';
    const option = this.formOptions.sexo.find(s => s.value === sexo);
    return option?.label || 'NÃO INFORMADO';
  }

  formatarData(data: string | null | undefined): string {
    if (!data) return 'NÃO INFORMADO';
    try {
      const dataObj = new Date(data);
      return dataObj.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'Data inválida';
    }
  }

  formatarClienteDesde(data: string | null | undefined): string {
    if (!data) return 'NÃO INFORMADO';

    if (/^\d{6}$/.test(data)) {
      const mes = data.slice(0, 2);
      const ano = data.slice(2, 6);
      return `${mes}/${ano}`;
    }

    try {
      const dataObj = new Date(data);
      return dataObj.toLocaleDateString('pt-BR', {
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'Data inválida';
    }
  }

  getIconeAtividade(tipo: string): string {
    return this.ICONES_ATIVIDADE[tipo] || 'fas fa-tasks';
  }

  // Getters mais seguros com tipagem
  get nomeExibicao(): string {
    return this.cliente?.nomeSocial || this.cliente?.nome || 'Nome não informado';
  }

  get emailExibicao(): string {
    return this.cliente?.email || 'Email não informado';
  }

  // get contatosExibicao(): string {
  //   return this.cliente?.telefone || 'Nenhum contato encontrado';
  /// }

  get clienteDesdeExibicao(): string {
    return this.cliente?.clienteDesde || 'NÃO INFORMADO';
  }

  ngOnInit() {
    const lastTab = localStorage.getItem('lastActiveTab');
    if (lastTab) {
      this.activeTab = lastTab;
    }

    // Combina a observação de params e queryParams
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.clienteId = +params['id'];
        this.carregarCliente(this.clienteId);

        // Observa os query parameters para atualizações
        this.route.queryParams.subscribe(queryParams => {
          // Carrega as atividades quando a página é carregada inicialmente
          // ou quando recebe o parâmetro de atualização
          if (queryParams['atualizarAtividades'] || !queryParams['timestamp']) {
            this.carregarAtividades();
          }
        });
      }
    });

    this.route.paramMap.subscribe(params => {
      const clienteId = params.get('id');
      if (clienteId) {
        this.telefoneService.listarTelefones(clienteId).subscribe({
          next: (data) => {
            this.telefones = data;
          },
          error: (error) => {
            console.error('Erro ao buscar telefones:', error);
          }
        });
      }
    });

    this.route.paramMap.subscribe(params => {
      const clienteId = params.get('id');
      if (clienteId) {
        this.enderecoService.listarEndereco(clienteId).subscribe({
          next: (data) => {
            this.enderecos = data;
          },
          error: (error) => {
            console.error('Erro ao buscar endereço:', error);
          }
        });
      }
    });

    this.route.paramMap.subscribe(params => {
      const clienteId = params.get('id');
      if (clienteId) {
        this.contatosService.listarContato(clienteId).subscribe({
          next: (data) => {
            this.contatos = data;
          },
          error: (error) => {
            console.error('Erro ao buscar endereço:', error);
          }
        });
      }
    });

    this.route.paramMap.subscribe(params => {
      const clientId = params.get('id');
      if (clientId) {
        this.notasService.listarNotas(clientId).subscribe({
          next: (data) => {
            this.content = data;
          },
          error: (error) => {
            console.error('Erro ao buscar nota:', error);
          }
        });
      }
    });
  }

  getTipoNome(tipo: TipoTelefone): string {
    const tipoOption = FORMS_OPTIONS.tipoTelefone.find(option => option.dbValue === tipo);
    return tipoOption ? tipoOption.label : 'Desconhecido';
  }

  getTipoEndereco(tipo: TipoEndereco): string {
    const tipoOption = FORM_OPTION.tipoEndereco.find(option => option.dbValue === tipo);
    return tipoOption ? tipoOption.label : 'Desconhecido';
  }

  getTipoContatos(tipo: TipoContato): string {
    const tipoOption = FORM_OPTIONS_CONTATOS.TipoContato.find(option => option.dbValue === tipo);
    return tipoOption ? tipoOption.label : 'Desconhecido';
  }

  carregarAtividades() {
    if (this.clienteId && this.cliente) {
      this.loading = true;
      this.atividadesService.listarAtividadesPorCliente(this.clienteId).subscribe({
        next: (response) => {
          this.atividades = response.map(atividade => ({
            ...atividade,
            clienteNome: this.cliente?.nome
          }));
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar atividades:', error);
          this.loading = false;
        }
      });
    }
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

  togglePerfilDetalhado() {
    this.mostrarPerfil = !this.mostrarPerfil;
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'atividades') {
      this.carregarAtividades();
    }
  }

  // Funções para os botões de ação
  editarCliente() {
    if (this.clienteId) {
      this.router.navigate(['/clientes/editar', this.clienteId]);
    }
  }

  excluirCliente() {
    if (!this.clienteId) return;

    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      this.clienteService.excluirCliente(this.clienteId).subscribe({
        next: () => {
          this.router.navigate(['/clientes']);
        },
        error: (error) => {
          console.error('Erro ao excluir cliente:', error);
          this.erro = 'Erro ao excluir cliente';
        }
      });
    }
  }

  getTipoAtividade(tipo: string): string {
    const tipos: { [key: string]: string } = {
      '19': 'Feedback',
      '1': 'Visita agendada',
      '2': 'Telefonar para',
      '3': 'Enviar email',
      '5': 'Contato',
      '21': 'Reunião Agendada',
      '22': 'Reunião Realizada',
      // Adicione outros mapeamentos conforme necessário
    };

    return tipos[tipo] || 'Atividade';
  }

  voltar() {
    this.router.navigate(['/clientes']);
  }

  onSubmit(): void {
    if (this.clienteId && this.form.valid) { // Verifica se o formulário é válido
      const content = this.form.value.content;
      this.notasService.criarNota(String(this.clienteId), { content })
        .subscribe({
          next: () => {
            this.form.reset(); // Limpa o formulário após o sucesso
            this.carregarNotas(); // Recarrega as notas
            //this.router.navigate(['/clientes/dash', this.clienteId]); // Redirecionamento opcional
          },
          error: (error) => {
            console.error('Erro ao criar nota:', error);
            // Adicione tratamento de erro para exibir uma mensagem ao usuário
          }
        });
    } else {
      console.error('Formulário inválido ou clientId ausente');
      // Adicione feedback visual para o usuário sobre o erro no formulário
    }
  }
  
  carregarNotas() {
      if (this.clienteId) {
        this.notasService.listarNotas(String(this.clienteId)).subscribe({
          next: (data) => {
            this.content = data;
          },
          error: (error) => {
            console.error('Erro ao buscar nota:', error);
          }
        });
      }
    }
}