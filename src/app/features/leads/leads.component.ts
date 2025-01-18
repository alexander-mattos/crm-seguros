import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { LeadService } from './services/lead.service';
import { Lead } from '@/backend/src/models/leads.model';

@Component({
  selector: 'app-leads',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    RouterModule
  ],
  templateUrl: './leads.component.html',
  styleUrl: './leads.component.css'
})
export class LeadsComponent {
  form!: FormGroup;
  leads: Lead[] = [];
  ladId: number | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private leadService: LeadService,
  ) {
    this.form = this.fb.group({
      nome: [''],
      nomeSocial: [''],
      tipoPessoa: ['0'],
      unidadeNegocio: ['0'],
      status: ['TODOS']
    });
  }

  ngOnInit() {
    this.carregarUltimosLeads();
  }
  
  

  carregarUltimosLeads() {
    this.loading = true;
    this.error = null;

    this.leadService.listarUltimosLeads(5).subscribe({
      next: (data) => {
        this.leads = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar leads:', error);
        this.error = 'Erro ao carregar lista de leads.';
        this.loading = false;
      }
    });
  }

  getLeads(): void {
    this.leadService.listarLeads().subscribe({
      next: (data) => {
        this.leads = data;
      },
      error: (err) => {
        console.error('Error fetching customers:', err);
      }
    });
  }

  redefinirPesquisa() {
    this.form.reset({
      nome: '',
      cpfCnpj: '',
      atividade: '',
      proprietario: 'ALEX MATTOS',
      status: '0',
      origem: '0'
    });
    this.carregarUltimosLeads();
  }

  voltar() {
    this.router.navigate(['']);
  }
}
