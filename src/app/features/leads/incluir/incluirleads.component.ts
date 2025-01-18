import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../components/header/header.component';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { cpfCnpjValidator, CpfCnpjValidatorDirective } from '../../../shared/directives/cpf-cnpj-validator.directive';
import { CpfCnpjMaskDirective } from '../../../shared/directives/cpf-cnpj-mask.directive';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { TelefoneMaskDirective } from '@/app/shared/directives/phone-mask.directive';
import { HttpClient } from '@angular/common/http';
import { CepMaskDirective } from '../../../shared/directives/cep-mask.directive';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { LeadService } from '../services/lead.service';
import { Lead } from '../../../../backend/src/models/leads.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-incluirleads',
  standalone: true,
  imports: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    ReactiveFormsModule,
    CommonModule,
    CpfCnpjMaskDirective,
    TelefoneMaskDirective,
    CepMaskDirective,
    NgxMaskDirective
  ],
  providers: [
    provideNgxMask(),
    CpfCnpjValidatorDirective
  ],
  templateUrl: './incluirleads.component.html',
  styleUrl: './incluirleads.component.css'
})

export class IncluirLeadsComponent implements OnInit {
  form: FormGroup;
  leadId: number | null = null;
  isEditMode: boolean = false;

  fontesLeads: string[] = [
    'Site',
    'Indicação',
    'Evento',
    'Facebook',
    'Instagram',
    'Google',
    'Telefone',
    'Outras'
  ];

  statusLead: string[] = [
    'AGUARDANDO CONTATO',
    'CONTACTADO',
    'FECHADO - CONVERTIDO',
    'FECHADO - NÃO CONVERTIDO'
  ];

  setores: string[] = [
    'Administrativo',
    'Comercial/Vendas',
    'Financeiro',
    'Marketing',
    'Operacional/Produção',
    'Recursos Humanos',
    'Tecnologia da Informação',
    'Jurídico',
    'Diretoria/Presidência',
    'Outros'
  ];

  constructor(
    private fb: FormBuilder,
    private leadService: LeadService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    this.form = this.fb.group({
      status: ['', Validators.required],
      origem: ['0'],
      nome: ['', Validators.required],
      empresa: [''],
      atividade: [''],
      celular: [''],
      telcomercial: [''],
      telresidencial: [''],
      tipoPessoa: ['0'],
      cpfCnpj: ['', [Validators.required, cpfCnpjValidator()]],
      setor: ['0'],
      email: ['', Validators.email],
      site: [''],
      cep: [''],
      endereco: [''],
      numero: [''],
      complemento: [''],
      bairro: [''],
      cidade: [''],
      estado: [''],
      receita: [''],
      nrFuncionarios: [''],
      descricao: [''],
    });
  }

  ngOnInit(): void {
    this.leadId = this.route.snapshot.params['id'];
    if (this.leadId) {
      this.isEditMode = true;
      this.leadService.obterLeadPorId(this.leadId).subscribe(lead => {
        this.form.patchValue(lead);
      });
    }
  }

  private validarCpfCnpj() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const valor = control.value.replace(/[^\d]/g, '');
      const tipoPessoa = this.form?.get('tipoPessoa')?.value;

      if (tipoPessoa === 'F') {
        return valor.length !== 11 ? { cpfInvalido: true } : null;
      } else {
        return valor.length !== 14 ? { cnpjInvalido: true } : null;
      }
    };
  }

  onSubmit(): void {
    if (this.form.valid) {
      const lead: Lead = this.form.value;
      if (this.isEditMode && this.leadId) {
        this.leadService.atualizarLead(this.leadId, lead).subscribe({
          next: () => {
            console.log('Customer updated successfully');
            this.router.navigate(['/leads/editar/leadId']);
          },
          error: (err) => {
            console.error('Error updating customer:', err);
          }
        });
      } else {
        this.leadService.criarLead(lead).subscribe({
          next: () => {
            console.log('Customer created successfully');
            this.router.navigate(['/leads/editar']);
          },
          error: (err) => {
            console.error('Error creating customer:', err);
          }
        });
      }
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

  voltar() {
    this.router.navigate(['/']);
  }
}

