import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from '../../../components/header/header.component';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { PropostaService } from '../services/proposta.service';

@Component({
  selector: 'app-apolices',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  providers: [PropostaService],
  templateUrl: './propostas.component.html',
  styleUrl: './propostas.component.css'
})

export class PropostasComponent implements OnInit {
  form: FormGroup;
  propostas: any[] = [];
 
  constructor(
    private fb: FormBuilder,
    private propostaService: PropostaService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      cliente: [''],
      numeroProposta: [''],
      documento: [''],
      numeroApolice: [''],
      placa: [''],
      unidadeNegocio: [''],
      dependente: [''],
      seguradora: [''],
      produto: [''],
      ramo: ['']
    });
  }
 
  ngOnInit() {
    this.carregarPropostas();
  }
 
  pesquisar() {
    console.log('Método pesquisar chamado');
    const formValue = this.form.getRawValue();
    console.log('Form value:', formValue);
  
    const filtros: Record<string, any> = {};
    Object.entries(formValue).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        filtros[key] = value;
      }
    });
    console.log('Filtros montados:', filtros);
  
    this.propostaService.listar(filtros).subscribe({
      next: (data) => {
        console.log('Dados recebidos:', data);
        this.propostas = data;
      },
      error: (error) => {
        console.error('Erro na listagem:', error);
        this.snackBar.open('Erro ao pesquisar', 'Fechar', { duration: 3000 });
      }
    });
  }
  
  limpar() {
    this.form.reset();
    this.carregarPropostas();
  }
 
  private carregarPropostas() {
    this.propostaService.listar().subscribe({
      next: (data) => {
        this.propostas = data;
      },
      error: (error) => {
        console.error('Erro ao carregar:', error);
        this.snackBar.open('Erro ao carregar propostas', 'Fechar', { duration: 4000 });
      }
    });
  }
 }