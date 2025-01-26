import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../components/header/header.component';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { RouterModule, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UnidadeNegocio } from '@/backend/src/models/unidadenegocio.model';
import { UnidadeNegocioService } from './services/unidadenegocio.service';

@Component({
  selector: 'app-unidadenegocio',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './unidadenegocio.component.html',
  styleUrl: './unidadenegocio.component.css'
})
export class UnidadenegocioComponent implements OnInit {
  filtroForm: FormGroup;
  unidadeNegocio: UnidadeNegocio[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private unidadeNegocioService: UnidadeNegocioService,
    private router: Router
  ) {
    this.filtroForm = this.fb.group({
      nome: ['']
    });
  }

  ngOnInit() {
    this.carregarUltimasUnidades();
  }

  carregarUltimasUnidades() {
    this.loading = true;
    this.error = null;

    this.unidadeNegocioService.listarUltimasUnidades(5).subscribe({
      next: (data) => {
        console.log('Unidades de Negócio recebidas:', data);
        this.unidadeNegocio = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar Unidades:', error);
        this.error = 'Erro ao carregar lista de Unidades.';
        this.loading = false;
      }
    });
  }

  pesquisar() {
    if (this.filtroForm.valid) {
      this.loading = true;
      this.error = null;

      this.unidadeNegocioService.listarUltimasUnidades(this.filtroForm.value).subscribe({
        next: (data) => {
          this.unidadeNegocio = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro na pesquisa:', error);
          this.error = 'Erro ao pesquisar Unidades.';
          this.loading = false;
        }
      });
    }
  }

  redefinirPesquisa() {
    this.filtroForm.reset({
      nome: ''
    });
    this.carregarUltimasUnidades();
  }

  novaUnidade() {
    this.router.navigate(['/configuracoes/unidadenegocio/incluir']);
  }

}
