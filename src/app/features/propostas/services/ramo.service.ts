import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../backend/src/environments/environment';
import { Ramo } from '../../../models/ramo.model';

@Injectable({
  providedIn: 'root'
})
export class RamoService {
  private apiUrl = `${environment.apiUrl}/ramos`;

  constructor(private http: HttpClient) {}

  listarRamos(): Observable<Ramo[]> {
    console.log('Chamando API de ramos:', this.apiUrl);
    return this.http.get<Ramo[]>(this.apiUrl);
  }

  obterRamoPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
