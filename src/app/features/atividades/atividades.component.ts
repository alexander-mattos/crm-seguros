import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AtividadeService } from './services/atividades.service';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { Atividade, AtividadeFiltro } from '@/app/shared/types/atividade.types';

@Component({
  selector: 'app-atividades',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    RouterModule
  ],
  templateUrl: './atividades.component.html',
  styleUrl: './atividades.component.css'
})
export class AtividadesComponent {
  atividades: Atividade[] = [];
  filtros: AtividadeFiltro = {
    tipoAtribuicao: 'P',
    filtro: 'T'
  };
  loading = false;

  constructor(
    private atividadeService: AtividadeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.pesquisar();
  }

  pesquisar() {
    this.loading = true;
    this.atividadeService.listarAtividades(this.filtros).subscribe({
      next: (data) => {
        this.atividades = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar atividades:', error);
        this.loading = false;
      }
    });
  }

  voltar() {
    this.router.navigate(['/clientes']);
  }
}