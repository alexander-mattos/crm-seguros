import { Injectable } from '@angular/core';
import { environment } from '../../../../../backend/src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UnidadeNegocio } from '@/backend/src/models/unidadenegocio.model';

@Injectable({
  providedIn: 'root'
})
export class UnidadeNegocioService {
  private apiUrl = `${environment.apiUrl}/configuracoes/unidadenegocio`;

  constructor(private http: HttpClient) { }

  criarUnidadeNegocio(unidadeNegocio: UnidadeNegocio): Observable<UnidadeNegocio> {
    return this.http.post<UnidadeNegocio>(`${this.apiUrl}/incluir`, unidadeNegocio);
  }

  listarUnidades(): Observable<UnidadeNegocio[]> {
    return this.http.get<UnidadeNegocio[]>(this.apiUrl);
  }

  listarUltimasUnidades(limite: number = 5): Observable<UnidadeNegocio[]> {
    const params = new HttpParams().set('limite', limite.toString());
    return this.http.get<{ success: boolean, data: UnidadeNegocio[] }>(this.apiUrl, { params }).pipe(
      map(response => response.data)
    );
  }

  obterUnidadePorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  atualizarUnidade(id: number, unidadeNegocio: Partial<UnidadeNegocio>): Observable<UnidadeNegocio> {
    return this.http.put<UnidadeNegocio>(`${this.apiUrl}/${id}`, unidadeNegocio);
  }

  excluirUnidade(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}