import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../backend/src/environments/environment';
import { Seguradora } from '@/app/models/seguradora.model';

@Injectable({
  providedIn: 'root'
})
export class SeguradoraService {
  private apiUrl = `${environment.apiUrl}/seguradoras`;

  constructor(private http: HttpClient) {}

  listarSeguradoras(): Observable<Seguradora[]> {
    return this.http.get<Seguradora[]>(this.apiUrl);
  }

  obterSeguradoraPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}