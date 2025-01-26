
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../backend/src/environments/environment';
import { Produtos } from '../../../../backend/src/models/produtos.model';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private apiUrl = `${environment.apiUrl}/produtos`;

  constructor(private http: HttpClient) {}

  listarProdutos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  listarProdutosPorRamo(ramoId: number): Observable<Produtos[]> {
    console.log('Chamando API de produtos:', `${this.apiUrl}/ramo/${ramoId}`);
    return this.http.get<Produtos[]>(`${this.apiUrl}/ramo/${ramoId}`);
  }

  obterProdutoPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}