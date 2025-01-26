import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../components/header/header.component';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { Seguradoras } from '@/backend/src/models/seguradoras.model';
import { SeguradoraService } from './services/seguradoras.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-seguradoras',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    ReactiveFormsModule
  ],
  templateUrl: './seguradoras.component.html',
  styleUrl: './seguradoras.component.css'
})
export class SeguradorasComponent implements OnInit {
  seguradora: Seguradoras[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private seguradoraService: SeguradoraService
  ){}

  ngOnInit() {
    this.carregarUltimasSeguradoras();
  }

  carregarUltimasSeguradoras() {
    this.loading = true;
    this.error = null;

    this.seguradoraService.listarUltimasSeguradoras(5).subscribe({
      next: (data) => {
        console.log('Seguradoras recebidas:', data);
        this.seguradora = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar Seguradoras:', error);
        this.error = 'Erro ao carregar lista de Seguradoras.';
        this.loading = false;
      }
    });
  }

}
