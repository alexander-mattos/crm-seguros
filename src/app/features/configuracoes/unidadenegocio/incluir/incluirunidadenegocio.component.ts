import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../../components/header/header.component';
import { SidebarComponent } from '../../../../components/sidebar/sidebar.component';
import { FooterComponent } from '../../../../components/footer/footer.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UnidadeNegocioService } from '../services/unidadenegocio.service';

@Component({
  selector: 'app-incluirunidadenegocio',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    ReactiveFormsModule
  ],
  providers: [
      Router,
      UnidadeNegocioService
    ],
  templateUrl: './incluirunidadenegocio.component.html',
  styleUrl: './incluirunidadenegocio.component.css'
})
export class IncluirunidadenegocioComponent implements OnInit {
  form: FormGroup = this.inicializarFormulario();
  feedback: { tipo: string; mensagem: string } | null = null;
  unidadeNegocioId: number | null = null;
  modoEdicao = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private unidadeNegocioService: UnidadeNegocioService
  ) {
    
  }

  private inicializarFormulario(): FormGroup {
    return this.fb.group({
      nome: ['', Validators.required],
      responsavel: [''],
      susep: [''],
      email: ['', [Validators.email]],
      cep: [''],
      endereco: [''],
      numero: [''],
      complemento: [''],
      bairro: [''],
      cidade: [''],
      estado: [''],
      telefone1: [''],
      telefone2: [''],
      celular: ['']
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
        this.unidadeNegocioId = +params['id'];
        this.modoEdicao = true;
      }
    });
  };

  voltar
    (): void {
    this.router.navigate(['/configuracoes/unidadenegocio']);
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Form Submitted', this.form.value);
      const request = this.unidadeNegocioId
        ? this.unidadeNegocioService.atualizarUnidade(this.unidadeNegocioId, this.form.value)
        : this.unidadeNegocioService.criarUnidadeNegocio(this.form.value);

      request.subscribe({
        next: (response: any) => {
          const novaUnidadeId = response.id || response?.data?.id;

          if (novaUnidadeId) {
            this.feedback = {
              tipo: 'success',
              mensagem: `Unidade de Negócio ${this.unidadeNegocioId ? 'atualizada' : 'criada'} com sucesso!`
            };

            setTimeout(() => {
              this.router.navigate(['/configuracoes/unidadenegocio']);
            }, 1500);
          }
        },
        error: (error) => {
          console.error(`Erro ao ${this.unidadeNegocioId ? 'atualizar' : 'criar'} Unidade de Negócio:`, error);
          this.feedback = {
            tipo: 'danger',
            mensagem: `Erro ao ${this.unidadeNegocioId ? 'atualizar' : 'criar'} unidade de negócio. Tente novamente.`
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
