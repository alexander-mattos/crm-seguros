import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../components/header/header.component';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AtividadeLead } from '../types/atividade.types';
import { LeadService } from '../services/lead.service';
import { ILeads } from '../types/leads.types';
import { ActivatedRoute, Router } from '@angular/router';
import { Lead } from '../../../../backend/src/models/leads.model';


@Component({
  selector: 'app-editarleads',
  imports: [
    CommonModule,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    ReactiveFormsModule
  ],
  providers: [
    LeadService
  ],
  templateUrl: './editarleads.component.html',
  styleUrl: './editarleads.component.css'
})
export class EditarleadsComponent implements OnInit {
  form!: FormGroup;
  isLoading: boolean = true;
  erro: string | null = null;
  activeTab = 'atividades';
  leadId: number | null = null;
  isEditMode: boolean = false;
  atividades: AtividadeLead[] = [];
  mostrarPerfil = false;
  atividadesLead: AtividadeLead[] = [];
  lead: ILeads | null = null;

  carregarLead(id: number) {
    this.isLoading = true;
    this.erro = null;

    this.leadService.obterLeadPorId(id).subscribe({
      next: (response) => {
        console.log('Dados dos leads recebidos:', response);
        if (response.data) {
          const dadosLead = response.data;
          this.lead = {
            ...dadosLead,
            status: dadosLead.status || 'PROSPECT',
            origem: dadosLead.origem || 'OUTROS',
            nome: dadosLead.nome || '',
            empresa: dadosLead.empresa || '',
            atividade: dadosLead.atividade || '',
            celular: dadosLead.celular || '',
            telcomercial: dadosLead.telcomercial || '',
            telresidencial: dadosLead.telresidencial || '',
            tipoPessoa: dadosLead.tipoPessoa || 'FISICA',
            cpfCnpj: dadosLead.cpfCnpj || '',
            setor: dadosLead.setor || '',
            email: dadosLead.email || '',
            site: dadosLead.site || '',
            cep: dadosLead.cep || '',
            endereco: dadosLead.endereco || '',
            numero: dadosLead.numero || '',
            complemento: dadosLead.complemento || '',
            bairro: dadosLead.bairro || '',
            cidade: dadosLead.cidade || '',
            estado: dadosLead.estado || '',
            receita: dadosLead.receita || '',
            nrFuncionarios: dadosLead.nrFuncionarios || '',
            descricao: dadosLead.descricao || ''
          };
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar dados do cliente:', error);
        this.erro = 'Erro ao carregar dados do cliente. Por favor, tente novamente.';
        this.isLoading = false;
      }
    });
  }

  constructor(
    private fb: FormBuilder,
    private leadService: LeadService,
    private route: ActivatedRoute,
    private router: Router
  ) {

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

  ngOnInit(): void {
    const lastTab = localStorage.getItem('lastActiveTab');
    if (lastTab) {
      this.activeTab = lastTab;
    }

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.leadId = +params['id'];
        this.isEditMode = true;
        this.carregarLead(this.leadId);
      }
    });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'atividades') {

    }
  }

  editarLead() {
    if (this.leadId) {
      this.router.navigate(['/clientes/editar', this.leadId]);
    }
  }

  excluirLead() {
    if (!this.leadId) return;

    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      this.leadService.excluirLead(this.leadId).subscribe({
        next: () => {
          this.router.navigate(['/leads']);
        },
        error: (error) => {
          console.error('Erro ao excluir cliente:', error);
          this.erro = 'Erro ao excluir cliente';
        }
      });
    }
  }

  togglePerfilDetalhado() {
    this.mostrarPerfil = !this.mostrarPerfil;
  }

  novaAtividade(event: Event) {
    event.preventDefault();
    if (this.leadId) {
      this.router.navigate(['/atividades/incluir'], {
        queryParams: {
          clienteId: this.leadId
        }
      });
    }
  }

  getIconeAtividade(tipo: string): string {
    return this.ICONES_ATIVIDADE[tipo] || 'fas fa-tasks';
  }

  voltar() {
    this.router.navigate(['/leads']);
  }

  onSubmit(): void {
    if (this.form.valid) {
      const lead: Lead = this.form.value;
      if (this.isEditMode && this.leadId) {
        this.leadService.atualizarLead(this.leadId, lead).subscribe({
          next: () => {
            console.log('Lead updated successfully');
            this.router.navigate(['/leads/editar', this.leadId]);
          },
          error: (err) => {
            console.error('Error updating lead:', err);
          }
        });
      } else {
        this.leadService.criarLead(lead).subscribe({
          next: (createdLead) => {
            console.log('Lead created successfully');
            this.router.navigate(['/leads/editar', createdLead.id]);
          },
          error: (err) => {
            console.error('Error creating lead:', err);
          }
        });
      }
    }
  }

}
