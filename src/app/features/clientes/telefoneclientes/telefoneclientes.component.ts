import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header.component';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TelefoneMaskDirective } from '@/app/shared/directives/phone-mask.directive';
import { FORMS_OPTIONS } from '../../../shared/types/telefone.types';
import { TelefoneService } from './services/telefone.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-telefoneclientes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TelefoneMaskDirective,
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ],
  templateUrl: './telefoneclientes.component.html',
  styleUrl: './telefoneclientes.component.css'
})

export class TelefoneclientesComponent implements OnInit {
  form!: FormGroup;
  tipoTelefoneOptions = FORMS_OPTIONS.tipoTelefone;
  clientId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private telefoneService: TelefoneService
  ) {
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.clientId = params.get('id');
    });
  }

  private inicializarFormulario() {
    this.form = this.fb.group({
      tipo: ['', Validators.required],
      numero: ['', [Validators.required, Validators.minLength(10)]],
      ramal: [''],
      contato: ['']
    });
  }

  onSubmit(): void {
    if (this.form.valid && this.clientId) {
      const formValues = this.form.value;
      const telefoneData = {
        ...formValues,
        numero: formValues.numero.replace(/\D/g, ''), // Remove formatação do número
        tipo: FORMS_OPTIONS.tipoTelefone.find(t => t.value === formValues.tipo)?.value
      };

      this.telefoneService.criarTelefone(this.clientId, telefoneData).subscribe({
        next: () => {
          this.router.navigate(['/clientes/dash', this.clientId]);
        },
        error: (error) => {
          console.error('Erro ao criar telefone:', error);
        }
      });
    } else {
      console.error('Formulário inválido ou clientId ausente');
    }
  }
}