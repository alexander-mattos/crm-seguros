import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../backend/src/environments/environment';
import { ITelefone } from '../../../../shared/types/telefone.types';

@Injectable({
    providedIn: 'root'
})
export class TelefoneService {
    private apiUrl = `${environment.apiUrl}/clientes`;

    constructor(private http: HttpClient) { }

    criarTelefone(clienteId: string, telefoneData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/telefones/${clienteId}`, {
            ...telefoneData,
            clienteId: clienteId
        });
    }

    listarTelefones(clienteId: string): Observable<ITelefone[]> {
        return this.http.get<ITelefone[]>(`${this.apiUrl}/telefones/${clienteId}`);
    }

    excluirTelefone(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}