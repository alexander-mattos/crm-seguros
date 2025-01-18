import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../backend/src/environments/environment';
import { INota } from '../../../../shared/types/notas.types';

@Injectable({
    providedIn: 'root'
  })
  
  export class NotasService {
    private apiUrl = `${environment.apiUrl}/clientes`;

    constructor(private http: HttpClient) { }

    criarNota(clienteId: string, notaData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/notas/${clienteId}`, {
            ...notaData,
            clienteId: clienteId
        });
    }

    listarNotas(clienteId: string): Observable<INota[]> {
        return this.http.get<INota[]>(`${this.apiUrl}/notas/${clienteId}`);
    }

    excluirNota(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}