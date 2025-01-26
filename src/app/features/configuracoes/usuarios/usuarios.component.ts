import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../components/header/header.component';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Usuario } from '../../../../backend/src/models/usuarios.models';
import { UsuariosService } from './services/usuarios.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {
  filtroForm: FormGroup;
  usuarios: Usuario[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private router: Router
  ) {
    this.filtroForm = this.fb.group({
      nome: ['']
    });
  }

  ngOnInit() {
    this.carregarUltimosUsuarios();
  }

  carregarUltimosUsuarios() {
    this.loading = true;
    this.error = null;

    this.usuariosService.listarUltimosUsuarios(5).subscribe({
      next: (data) => {
        console.log('Usuários recebidos:', data);
        this.usuarios = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar usuários:', error);
        this.error = 'Erro ao carregar lista de usuários.';
        this.loading = false;
      }
    });
  }

  pesquisar() {
    if (this.filtroForm.valid) {
      this.loading = true;
      this.error = null;

      this.usuariosService.listarUltimosUsuarios(this.filtroForm.value).subscribe({
        next: (data) => {
          this.usuarios = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro na pesquisa:', error);
          this.error = 'Erro ao pesquisar usuários.';
          this.loading = false;
        }
      });
    }
  }

  redefinirPesquisa() {
    this.filtroForm.reset({
      nome: ''
    });
    this.carregarUltimosUsuarios();
  }

  novoUsuario() {
    this.router.navigate(['/configuracoes/usuarios/incluir']);
  }

}
