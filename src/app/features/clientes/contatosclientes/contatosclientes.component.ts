import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../../../components/footer/footer.component';
import { HeaderComponent } from '../../../components/header/header.component';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FORM_OPTIONS_CONTATOS } from '../../../shared/types/contatos.types';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { ContatosService } from './services/contatos.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contatosclientes',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,

  ],
  templateUrl: './contatosclientes.component.html',
  styleUrl: './contatosclientes.component.css'
})
export class ContatosClientesComponent implements OnInit {
  form!: FormGroup;
  tipoContatosOptions = FORM_OPTIONS_CONTATOS.TipoContato;
  clientId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private contatosService: ContatosService,
    private http: HttpClient
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
      nome: ['', Validators.required],
      sexo: [''],
      cargo: [''],
      tratamento: [''],
      email: [''],
      dtNascimento: [''],
      cpf: [''],
      telefone: [''],
      celular: ['']
    });
  }

  onSubmit(): void {
    if (this.form.valid && this.clientId) {
      console.log('Enviando contato para clienteId:', this.clientId); // Log para verificar o `clientId`
      const formValues = this.form.value;
      const contatosData = {
        ...formValues,
        telefone: formValues.telefone.replace(/\D/g, ''), // Remove formatação do telefone
        celular: formValues.celular.replace(/\D/g, ''), // Remove formatação do celular
        tipo: FORM_OPTIONS_CONTATOS.TipoContato.find(t => t.value === formValues.tipo)?.value,
        nome: formValues.nome,
        sexo: formValues.sexo,
        tratamento: formValues.tratamento,
        email: formValues.email,
        dtNascimento: formValues.dtNascimento.replace(/\D/g, ''),
        cpf: formValues.cpf.replace(/\D/g, ''),
      };

      this.contatosService.criarContato(this.clientId, contatosData).subscribe({
        next: () => {
          this.router.navigate(['/clientes/dash', this.clientId]);
        },
        error: (error) => {
          console.error('Erro ao criar contato:', error);
        }
      });
    } else {
      console.error('Formulário inválido ou clientId ausente');
    }
  }
}
