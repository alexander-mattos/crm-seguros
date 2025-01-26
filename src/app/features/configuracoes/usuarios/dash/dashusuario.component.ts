import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../../components/header/header.component';
import { SidebarComponent } from '../../../../components/sidebar/sidebar.component';
import { FooterComponent } from '../../../../components/footer/footer.component';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuariosService } from '../services/usuarios.service';
import { Usuario } from '../../../../../backend/src/models/usuarios.models';

interface Menu {
  nome: string;
  liberado: boolean;
}

@Component({
  selector: 'app-dashusuario',
  imports: [
    CommonModule,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './dashusuario.component.html',
  styleUrls: ['./dashusuario.component.css']
})
export class DashusuarioComponent implements OnInit {
  form: FormGroup;
  usuarios: Usuario[] = [];
  usuarioId: number | null = null;
  loading = true;
  error: string | null = null;
  modoEdicao = false;
  menus: Menu[] = []; // Definindo a propriedade menus

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usuariosService: UsuariosService,
  ) {
    this.form = this.fb.group({
      nome: [{ value: '', disabled: true }, Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      status: [{ value: 'Ativo', disabled: true }, Validators.required],
      gestor: [{ value: '', disabled: true }],
      telefone: [{ value: '', disabled: true }],
      celular: [{ value: '', disabled: true }],
      administrador: [{ value: false, disabled: true }, Validators.required],
      emailDiario: [{ value: 'S', disabled: true }, Validators.required],
      criadoPor: [{ value: '', disabled: true }],
      alteradoPor: [{ value: '', disabled: true }],
      dataCriacao: [{ value: '', disabled: true }],
      dtAlteracao: [{ value: '', disabled: true }]
    });

    // Inicializando a propriedade menus
    this.menus = [
      { nome: 'Gestão Financeira', liberado: true },
      { nome: 'Atendimentos', liberado: true },
      { nome: 'Dashboard', liberado: true },
      { nome: 'Meu dia', liberado: true },
      { nome: 'Agenda', liberado: true },
      { nome: 'Clientes', liberado: true },
      { nome: 'Leads', liberado: true },
      { nome: 'Oportunidades', liberado: true },
      { nome: 'Apólices', liberado: true },
      { nome: 'Apólices Coletivas', liberado: true },
      { nome: 'Multi Cálculo', liberado: true },
      { nome: 'Financeiro', liberado: true },
      { nome: 'Sinistros', liberado: true },
      { nome: 'Cross Selling', liberado: true },
      { nome: 'Campanhas', liberado: true },
      { nome: 'Importador', liberado: true },
      { nome: 'Arquivos', liberado: true },
      { nome: 'Mural', liberado: true },
      { nome: 'Relatórios', liberado: true },
      { nome: 'Configurações', liberado: true },
      { nome: 'JusProtectMed', liberado: true }
    ];
  }

  editarUsuario() {
    if (this.usuarioId) {
      this.router.navigate(['/configuracoes/usuarios/dash', this.usuarioId]);
      this.form.enable();
    }
  }

  excluirUsuario() {
    if (!this.usuarioId) return;

    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      this.usuariosService.excluirUsuario(this.usuarioId).subscribe({
        next: () => {
          this.router.navigate(['/configuracoes/usuarios']);
        },
        error: (error) => {
          console.error('Erro ao excluir usuário:', error);
          this.error = 'Erro ao excluir usuário';
        }
      });
    }
  }

  voltar() {
    this.router.navigate(['/configuracoes/usuarios']);
  }

  ngOnInit(): void {
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
        if (this.usuarios.length > 0) {
          this.preencherFormulario(this.usuarios[0]);
        }
      },
      error: (error) => {
        console.error('Erro ao carregar usuários:', error);
        this.error = 'Erro ao carregar lista de usuários.';
        this.loading = false;
      }
    });
  }

  preencherFormulario(usuario: Usuario) {
    this.form.patchValue({
      nome: usuario.nome,
      email: usuario.email,
      status: usuario.status,
      gestor: usuario.gestor,
      telefone: usuario.telefone,
      celular: usuario.celular,
      administrador: usuario.administrador,
      emailDiario: usuario.emailDiario,
      criadoPor: usuario.criadoPor,
      dataCriacao: usuario.dataCriacao,
      dtAlteracao: usuario.dataAlteracao
    });
  }
}