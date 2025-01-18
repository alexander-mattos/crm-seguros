import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header.component';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FORM_OPTION } from '../../../shared/types/endereco.types';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { EnderecoService } from './services/endereco.service';
import { HttpClient } from '@angular/common/http';
import { CepMaskDirective } from '../../../shared/directives/cep-mask.directive';

@Component({
  selector: 'app-enderecoclientes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    CepMaskDirective
  ],
  templateUrl: './enderecoclientes.component.html',
  styleUrl: './enderecoclientes.component.css'
})
export class EnderecoClientesComponent implements OnInit {
  form!: FormGroup;
  tipoEnderecoOptions = FORM_OPTION.tipoEndereco;
  clientId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private enderecoService: EnderecoService,
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
      cep: ['', Validators.required],
      endereco: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: ['', Validators.required],
      correspondencia: [''],
      aoscuidados: ['']
    });
  }

  onSubmit(): void {
    if (this.form.valid && this.clientId) {
      console.log('Enviando endereco para clienteId:', this.clientId); // Log para verificar o `clientId`
      const formValues = this.form.value;
      const enderecoData = {
        ...formValues,
        cep: formValues.cep.replace(/\D/g, ''), // Remove formatação do cep
        tipo: FORM_OPTION.tipoEndereco.find(t => t.value === formValues.tipo)?.value,
        endereco: formValues.endereco,
        numero: formValues.numero,
        bairro: formValues.bairro,
        cidade: formValues.cidade,
        estado: formValues.estado
      };

      this.enderecoService.criarEndereco(this.clientId, enderecoData).subscribe({
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

  async fetchAddress(event: any): Promise<void> {
    const cep = event.target.value.replace(/\D/g, '');
    
    if (cep && cep.length === 8) {
      try {
        const data = await this.http.get<any>(`https://viacep.com.br/ws/${cep}/json/`)
          .toPromise();
  
        if (!data.erro) {
          this.form.patchValue({
            endereco: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf
          });
        } else {
          console.error('CEP não encontrado');
          this.form.patchValue({
            endereco: '',
            bairro: '',
            cidade: '',
            estado: ''
          });
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    }
  }
}
