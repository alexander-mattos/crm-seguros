import { Injectable } from '@angular/core';
import { environment } from '../../../../../backend/src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Seguradoras } from '../../../../../backend/src/models/seguradoras.model';

@Injectable({
  providedIn: 'root'
})
export class SeguradoraService {
  private apiUrl = `${environment.apiUrl}/configuracoes/seguradoras`;

  constructor(private http: HttpClient) { }

  criarSeguradora(seguradoras: Seguradoras): Observable<Seguradoras> {
    return this.http.post<Seguradoras>(`${this.apiUrl}/incluir`, seguradoras);
  }

  listarSeguradoras(): Observable<Seguradoras[]> {
    return this.http.get<Seguradoras[]>(this.apiUrl);
  }

  listarUltimasSeguradoras(limite: number = 5): Observable<Seguradoras[]> {
    const params = new HttpParams().set('limite', limite.toString());
    return this.http.get<{ success: boolean, data: Seguradoras[] }>(this.apiUrl, { params }).pipe(
      map(response => response.data)
    );
  }

  obterSeguradoraPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  atualizarSeguradora(id: number, seguradoras: Partial<Seguradoras>): Observable<Seguradoras> {
    return this.http.put<Seguradoras>(`${this.apiUrl}/${id}`, seguradoras);
  }

  excluirSeguradora(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}