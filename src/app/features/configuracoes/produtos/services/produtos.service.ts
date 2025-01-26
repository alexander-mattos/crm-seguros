import { Injectable } from '@angular/core';
import { environment } from '../../../../../backend/src/environments/environment';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Produtos } from '../../../../../backend/src/models/produtos.model';
import { Seguradoras } from '../../../../../backend/src/models/seguradoras.model';

interface ProdutosResponse {
  success: boolean;
  data: Produtos[];
  total: number;
  page: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root'
})

export class ProdutosService {
  private apiUrl = `${environment.apiUrl}/configuracoes`;

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    console.error('Erro na requisição:', error);
    let errorMessage = 'Ocorreu um erro no servidor.';

    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.error?.error) {
      errorMessage = error.error.error;
    }

    return throwError(() => errorMessage);
  }

  private formatProdutoData(formData: Produtos) {
    return {
      nome: String(formData.nome || '').trim(),
      codigo: String(formData.codigo || '').trim(),
      descricao: formData.descricao === '0' ? '' : String(formData.descricao || '').trim(),
      ativo: formData.ativo,
      exibirNoOrcamento: formData.exibirNoOrcamento,
      seguradoraId: Number(formData.seguradoraId),
      ramoId: Number(formData.ramoId),
      comissaoSobreAdicional: formData.comissaoSobreAdicional,
      iof: String(formData.iof || '0'),
      seguroPorAssinatura: formData.seguroPorAssinatura,
      valorPrimeira: String(formData.valorPrimeira || '0'),
      valorDemais: String(formData.valorDemais || '0'),
      questionarioDeVenda: String(formData.questionarioDeVenda || '').trim()
    };
  }

  criarProduto(produto: any): Observable<any> {
    const produtoFormatado = this.formatProdutoData(produto);
    console.log('Dados formatados para envio:', produtoFormatado);

    // Validação básica
    if (!produtoFormatado.nome || !produtoFormatado.codigo) {
      return throwError(() => 'Nome e código são obrigatórios');
    }

    if (!produtoFormatado.seguradoraId || !produtoFormatado.ramoId) {
      return throwError(() => 'Seguradora e Ramo são obrigatórios');
    }

    return this.http.post(`${this.apiUrl}/produtos/incluir`, produtoFormatado)
      .pipe(
        map(response => {
          console.log('Resposta do servidor:', response);
          return response;
        }),
        catchError(this.handleError)
      );
  }

  listarProdutos(page: number = 1, pageSize: number = 10): Observable<ProdutosResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
  
    return this.http.get<any>(`${this.apiUrl}/produtos`, { params }).pipe(
      map(response => response.data)
    );
  }

  listarUltimosProdutos(limite: number = 5): Observable<Produtos[]> {
    const params = new HttpParams().set('limite', limite.toString());
    return this.http.get<{ success: boolean, data: Produtos[] }>(`${this.apiUrl}/produtos`, { params }).pipe(
      map(response => response.data)
    );
  }

  obterProdutosPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/produtos/${id}`);
  }

  atualizarProduto(id: number, produto: Partial<Produtos>): Observable<Produtos> {
    return this.http.put<Produtos>(`${this.apiUrl}/produtos/${id}`, produto);
  }

  excluirProduto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/produtos/${id}`);
  }

  listarUltimasSeguradoras(limite: number = 5): Observable<Seguradoras[]> {
    const params = new HttpParams().set('limite', limite.toString());
    return this.http.get<{ success: boolean, data: Seguradoras[] }>(`${this.apiUrl}/seguradoras`, { params }).pipe(
      map(response => response.data)
    );
  }

  getRamos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ramos`);
  }

}