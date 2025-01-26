import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../backend/src/environments/environment';
import { Seguradoras } from '../../../../backend/src/models/seguradoras.model';

@Injectable({
  providedIn: 'root'
})
export class SeguradoraService {
  private apiUrl = `${environment.apiUrl}/seguradoras`;

  constructor(private http: HttpClient) {}

  listarSeguradoras(): Observable<Seguradoras[]> {
    return this.http.get<Seguradoras[]>(this.apiUrl);
  }

  obterSeguradoraPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}