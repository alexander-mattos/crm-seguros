import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ClienteService } from '../services/cliente.service';
import { HeaderComponent } from '../../../components/header/header.component';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { Cliente } from '../../../../backend/src/models';
import { TipoPessoaPipe } from '@/app/shared/pipes/tipo-pessoa.pipe';
import { StatusClientePipe } from '@/app/shared/pipes/status.pipe';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    TipoPessoaPipe,
    StatusClientePipe
  ],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})

export class ClientesComponent implements OnInit {
  filtroForm: FormGroup;
  clientes: Cliente[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private router: Router
  ) {
    this.filtroForm = this.fb.group({
      nome: [''],
      nomeSocial: [''],
      tipoPessoa: ['0'],
      unidadeNegocio: ['0'],
      status: ['TODOS']
    });
  }

  ngOnInit() {
    this.carregarUltimosClientes();
  }

  carregarUltimosClientes() {
    this.loading = true;
    this.error = null;

    this.clienteService.listarUltimosClientes(5).subscribe({
      next: (data) => {
        this.clientes = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar clientes:', error);
        this.error = 'Erro ao carregar lista de clientes.';
        this.loading = false;
      }
    });
  }

  pesquisar() {
    if (this.filtroForm.valid) {
      this.loading = true;
      this.error = null;

      this.clienteService.listarClientesComFiltro(this.filtroForm.value).subscribe({
        next: (data) => {
          this.clientes = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro na pesquisa:', error);
          this.error = 'Erro ao pesquisar clientes.';
          this.loading = false;
        }
      });
    }
  }

  redefinirPesquisa() {
    this.filtroForm.reset({
      nome: '',
      nomeSocial: '',
      tipoPessoa: '0',
      unidadeNegocio: '0',
      status: 'TODOS'
    });
    this.carregarUltimosClientes();
  }

  novoCliente() {
    this.router.navigate(['/clientes/incluir']);
  }
}