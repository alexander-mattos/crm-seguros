import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
  })
  export class ClienteService {
    constructor(private http: HttpClient) {}
  
    private handleError(error: any): Observable<never> {
      console.error('Ocorreu um erro:', error);
      return throwError(() => new Error('Erro na operação. Por favor, tente novamente.'));
    }
  
    getClientes(params: {
      skip?: number;
      take?: number;
      search?: string;
      tipoPessoa?: string;
      status?: string;
    }): Observable<PaginatedResponse<Cliente>> {
      return this.http.get<PaginatedResponse<Cliente>>('/api/clientes', { params })
        .pipe(
          catchError(this.handleError)
        );
    }
  
    getClienteById(id: number): Observable<Cliente> {
      return this.http.get<Cliente>(`/api/clientes/${id}`).pipe(
        catchError(this.handleError)
      );
    }
  
    createCliente(cliente: Partial<Cliente>): Observable<Cliente> {
      // Validação dos campos obrigatórios antes do envio
      if (!cliente.nome || !cliente.tipoPessoa) {
        return throwError(() => new Error('Campos obrigatórios não preenchidos'));
      }
  
      return this.http.post<Cliente>('/api/clientes', cliente).pipe(
        catchError(this.handleError)
      );
    }
  }