import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../backend/src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PropostaService {
  private apiUrl = `${environment.apiUrl}/propostas`;

  constructor(private http: HttpClient) { }

  criar(proposta: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/incluir`, proposta);
  }

  atualizar(id: number, proposta: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, proposta);
  }

  buscarPorId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  listar(filtros?: any): Observable<any> {
    let params = new HttpParams();

    Object.keys(filtros || {}).forEach(key => {
      if (filtros[key]) {
        params = params.append(key, filtros[key]);
      }
    });

    return this.http.get(this.apiUrl, { params });
  }

  excluir(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}