import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../../components/header/header.component';
import { SidebarComponent } from '../../../../components/sidebar/sidebar.component';
import { FooterComponent } from '../../../../components/footer/footer.component';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProdutosService } from '../services/produtos.service';
import { TextEditorComponent } from '../../../../components/editor/text-editor.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-incluirprodutos',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    ReactiveFormsModule,
    TextEditorComponent
  ],
  providers: [
    ProdutosService,
    Router
  ],
  templateUrl: './incluirprodutos.component.html',
  styleUrl: './incluirprodutos.component.css'
})

export class IncluirprodutosComponent implements OnInit {
  form!: FormGroup;
  feedback: { tipo: string; mensagem: string } | null = null;
  produtosId: number | null = null;
  seguradoras: any[] = [];
  ramos: any[] = [];
  produtoId: number | null = null;
  modoEdicao = false;
  submitted = false;;

  constructor(
    private fb: FormBuilder,
    private produtosService: ProdutosService,
    private router: Router
  ) {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      codigo: ['', [Validators.required, Validators.minLength(2)]],
      descricao: ['0'],
      ativo: ['A'],
      exibirNoOrcamento: ['S'],
      seguradoraId: ['0', [Validators.required, Validators.min(1)]],
      ramoId: ['0', [Validators.required, Validators.min(1)]],
      comissaoSobreAdicional: ['N'],
      iof: ['0'],
      seguroPorAssinatura: ['N'],
      valorPrimeira: ['0'],
      valorDemais: ['0'],
      questionarioDeVenda: ['']
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.produtosService.listarUltimasSeguradoras().subscribe({
      next: (data) => {
        this.seguradoras = data;
      },
      error: (error) => {
        console.error('Erro ao carregar seguradoras:', error);
        this.feedback = {
          tipo: 'danger',
          mensagem: 'Erro ao carregar seguradoras'
        };
      }
    });

    this.produtosService.getRamos().subscribe({
      next: (data) => {
        this.ramos = data;
      },
      error: (error) => {
        console.error('Erro ao carregar ramos:', error);
        this.feedback = {
          tipo: 'danger',
          mensagem: 'Erro ao carregar ramos'
        };
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    console.log('Form value before submission:', this.form.value);

    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control?.invalid) {
          control.markAsTouched();
          console.log(`Campo ${key} inválido:`, control.errors);
        }
      });

      this.feedback = {
        tipo: 'danger',
        mensagem: 'Por favor, preencha todos os campos obrigatórios corretamente.'
      };
      return;
    }

    this.produtosService.criarProduto(this.form.value).subscribe({
      next: (response) => {
        this.feedback = {
          tipo: 'success',
          mensagem: 'Produto criado com sucesso!'
        };
        setTimeout(() => {
          this.router.navigate(['/configuracoes/produtos']);
        }, 2500);
      },
      error: (error) => {
        console.error('Erro ao criar produto:', error);
        this.feedback = {
          tipo: 'danger',
          mensagem: typeof error === 'string' ? error : 'Erro ao criar produto. Por favor, tente novamente.'
        };
      }
    });
  }

  // Helper methods for form validation
  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!field && field.invalid && (field.touched || this.submitted);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'Campo obrigatório';
    if (control.errors['minlength']) return `Mínimo de ${control.errors['minlength'].requiredLength} caracteres`;
    if (control.errors['min']) return 'Valor inválido';

    return 'Campo inválido';
  }
}