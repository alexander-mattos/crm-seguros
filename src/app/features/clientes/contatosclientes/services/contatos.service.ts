import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../backend/src/environments/environment';
import { IContato } from '../../../../shared/types/contatos.types';

@Injectable({
    providedIn: 'root'
})
export class ContatosService {
    private apiUrl = `${environment.apiUrl}/clientes`;

    constructor(private http: HttpClient) { }

    criarContato(clienteId: string, contatoData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/contatos/${clienteId}`, {
            ...contatoData,
            clienteId: clienteId
        });
    }

    listarContato(clienteId: string): Observable<IContato[]> {
        return this.http.get<IContato[]>(`${this.apiUrl}/contatos/${clienteId}`);
    }

    excluirContato(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}