import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../components/header/header.component';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { ProdutosService } from './services/produtos.service';
import { Produtos } from '@/backend/src/models/produtos.model';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ],
  templateUrl: './produtos.component.html',
  styleUrl: './produtos.component.css'
})
export class ProdutosComponent implements OnInit {
  seguradoras: any[] = [];
  ramos: any[] = [];
  produtos: Produtos[] = [];
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;
  loading = false;
  error: string | null = null;

  constructor(
    private produtosService: ProdutosService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadProdutos();
    this.loadSeguradoras();
    this.loadRamos();
  }

  trackByFn(_: number, produto: Produtos): number {
    return produto.id || 0;
  }

  loadProdutos() {
    console.log('Loading page:', this.currentPage);
    this.produtosService.listarProdutos(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        if (response?.data) {
          this.produtos = response.data;
          this.totalItems = response.total;
          this.totalPages = Math.ceil(this.totalItems / this.pageSize);
          console.log('Current page:', this.currentPage, 'Data:', this.produtos);
        }
      }
    });
  }

  loadSeguradoras() {
    this.produtosService.listarUltimasSeguradoras(5).subscribe(data => {
      this.seguradoras = Array.isArray(data) ? data : [];
    });
  }

  loadRamos() {
    this.produtosService.getRamos().subscribe(data => {
      this.ramos = Array.isArray(data) ? data : [];
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      console.log('Próxima página');
      this.currentPage++;
      this.loadProdutos();
    }
  }
  
  previousPage() {
    if (this.currentPage > 1) {
      console.log('Página anterior');
      this.currentPage--;
      this.loadProdutos();
    }
  }
}
