import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../backend/src/environments/environment';
import { ICliente } from '@/backend/src/shared/types/cliente.types';

@Injectable({
    providedIn: 'root'
  })
  export class ClienteService {
    private apiUrl = `${environment.apiUrl}/clientes`;
  
    constructor(private http: HttpClient) {}
  
  
    listarClientesOrdenados(): Observable<ICliente[]> {
      return this.http.get<ICliente[]>(`${this.apiUrl}`);
    }
  
    buscarClientesPorNome(nome: string): Observable<ICliente[]> {
      return this.http.get<ICliente[]>(`${this.apiUrl}`, {
        params: { nome }
      });
    }
  }