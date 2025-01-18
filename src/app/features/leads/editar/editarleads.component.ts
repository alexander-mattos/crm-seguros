import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../components/header/header.component';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { AtividadeLead } from '../types/atividade.types';
import { LeadService } from '../services/lead.service';
import { ILeads } from '../types/leads.types';
import { ApiResponse } from '../../../models/api.model';


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
  lead: ILeads | null = null;
  loading = true;
  erro: string | null = null;
  activeTab = 'atividades';
  leadId: number | null = null;
  atividades: AtividadeLead[] = [];
  mostrarPerfil = false;
  atividadesLead: AtividadeLead[] = [];


  constructor(
    private fb: FormBuilder,
    private leadsService: LeadService
  ) {

  }

  ngOnInit() {

  }

  

  setActiveTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'atividades') {
      
    }
  }

}
