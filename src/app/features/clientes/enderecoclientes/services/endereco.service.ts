import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../backend/src/environments/environment';
import { IEndereco } from '../../../../shared/types/endereco.types';

@Injectable({
    providedIn: 'root'
})
export class EnderecoService {
    private apiUrl = `${environment.apiUrl}/clientes`;

    constructor(private http: HttpClient) { }

    criarEndereco(clienteId: string, enderecoData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/endereco/${clienteId}`, {
            ...enderecoData,
            clienteId: clienteId
        });
    }

    listarEndereco(clienteId: string): Observable<IEndereco[]> {
        return this.http.get<IEndereco[]>(`${this.apiUrl}/endereco/${clienteId}`);
    }

    excluirEndereco(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}