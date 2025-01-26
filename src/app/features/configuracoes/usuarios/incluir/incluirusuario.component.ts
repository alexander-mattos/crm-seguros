import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../../components/header/header.component';
import { SidebarComponent } from '../../../../components/sidebar/sidebar.component';
import { FooterComponent } from '../../../../components/footer/footer.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuariosService } from '../services/usuarios.service';

@Component({
  selector: 'app-incluirusuario',
  imports: [
    CommonModule,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    RouterModule,
    ReactiveFormsModule,

  ],
  providers: [
    Router,
    UsuariosService
  ],
  templateUrl: './incluirusuario.component.html',
  styleUrl: './incluirusuario.component.css'
})
export class IncluirusuarioComponent implements OnInit {
  form: FormGroup = this.inicializarFormulario();
  feedback: { tipo: string; mensagem: string } | null = null;
  usuarioId: number | null = null;
  modoEdicao = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private usuariosService: UsuariosService
  ) { }

  private inicializarFormulario(): FormGroup {
    return this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      status: ['Ativo', Validators.required],
      gestor: [''],
      telefone: [''],
      celular: [''],
      administrador: [false, Validators.required],
      emailDiario: ['S', Validators.required],
      criadoPor: [''],
      dataCriacao: [{ value: '', disabled: true }],
      dtAlteracao: [{ value: '', disabled: true }]
    });
  }

  ngOnInit(): void {
    const dataAtual = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    this.form.patchValue({
      dataCriacao: dataAtual,
      dtAlteracao: dataAtual
    });
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.usuarioId = +params['id'];
        this.modoEdicao = true;
      }
    });
  };

  isFieldInvalid(field: string): boolean {
    const formField = this.form.get(field);
    return formField ? (formField.invalid && (formField.dirty || formField.touched)) : false;
  }

  voltar
    (): void {
    this.router.navigate(['/configuracoes/usuarios']);
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Form Submitted', this.form.value);
      const request = this.usuarioId
        ? this.usuariosService.atualizarUsuario(this.usuarioId, this.form.value)
        : this.usuariosService.criarUsuario(this.form.value);

      request.subscribe({
        next: (response: any) => {
          const novoUsuarioId = response.id || response?.data?.id;

          if (novoUsuarioId) {
            this.feedback = {
              tipo: 'success',
              mensagem: `Usuário ${this.usuarioId ? 'atualizado' : 'criado'} com sucesso!`
            };

            setTimeout(() => {
              this.router.navigate(['/configuracoes/usuarios']);
            }, 1500);
          }
        },
        error: (error) => {
          console.error(`Erro ao ${this.usuarioId ? 'atualizar' : 'criar'} usuário:`, error);
          this.feedback = {
            tipo: 'danger',
            mensagem: `Erro ao ${this.usuarioId ? 'atualizar' : 'criar'} usuário. Tente novamente.`
          };
        }
      });
    } else {
      console.log('Campos inválidos:',
        Object.keys(this.form.controls)
          .filter(key => this.form.get(key)?.errors)
          .map(key => `${key}: ${JSON.stringify(this.form.get(key)?.errors)}`)
      );

      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });

      this.feedback = {
        tipo: 'danger',
        mensagem: 'Por favor, preencha todos os campos obrigatórios corretamente.'
      };
    }
  }
}
