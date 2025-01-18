
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Lead } from '../../../../backend/src/models/leads.model';
import { environment } from '../../../../backend/src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeadService {
  private apiUrl = `${environment.apiUrl}/leads`;

  constructor(private http: HttpClient) { }

  criarLead(lead: Lead): Observable<Lead> {
    return this.http.post<Lead>(`${this.apiUrl}/incluir`, lead);
  }

  listarLeads(): Observable<Lead[]> {
    return this.http.get<Lead[]>(`${this.apiUrl}`);
  }

  listarLeadsComFiltro(filtros: {
    nome?: string;
    nomeSocial?: string;
    tipoPessoa?: string;
    unidadeNegocio?: string;
    status?: string;
  }): Observable<Lead[]> {
    let params = new HttpParams();

    if (filtros.nome) params = params.set('nome', filtros.nome);
    if (filtros.nomeSocial) params = params.set('nomeSocial', filtros.nomeSocial);
    if (filtros.tipoPessoa && filtros.tipoPessoa !== '0') {
      params = params.set('tipoPessoa', filtros.tipoPessoa);
    }
    if (filtros.unidadeNegocio && filtros.unidadeNegocio !== '0') {
      params = params.set('unidadeNegocio', filtros.unidadeNegocio);
    }
    if (filtros.status && filtros.status !== 'TODOS') {
      params = params.set('status', filtros.status);
    }

    return this.http.get<Lead[]>(this.apiUrl, { params });
  }

  listarUltimosLeads(limite: number = 5): Observable<Lead[]> {
    const params = new HttpParams().set('limite', limite.toString());
    return this.http.get<Lead[]>(this.apiUrl, { params });
  }


  obterLeadPorId(id: number): Observable<Lead> {
    return this.http.get<Lead>(`${this.apiUrl}/${id}`);
  }

  atualizarLead(id: number, lead: Partial<Lead>): Observable<Lead> {
    return this.http.put<Lead>(`${this.apiUrl}/${id}`, lead);
  }

  excluirLead(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Métodos adicionais que podem ser úteis
  buscarPorCpfCnpj(cpfCnpj: string): Observable<Lead[]> {
    return this.http.get<Lead[]>(`${this.apiUrl}/buscar`, {
      params: { cpfCnpj }
    });
  }

  buscarPorNome(nome: string): Observable<Lead[]> {
    return this.http.get<Lead[]>(`${this.apiUrl}/buscar`, {
      params: { nome }
    });
  }

  // Métodos auxiliares para formatação
  private limparNumeroTelefone(numero: string): string {
    return numero.replace(/\D/g, '');
  }

  private limparCep(cep: string): string {
    return cep.replace(/\D/g, '');
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let mensagem = 'Ocorreu um erro na importação';

    if (error.error?.message) {
      mensagem = error.error.message;
    } else if (error.error instanceof ErrorEvent) {
      mensagem = `Erro de rede: ${error.error.message}`;
    } else {
      mensagem = `Erro do servidor (${error.status}): ${error.error?.mensagem || 'Erro desconhecido'}`;
    }

    return throwError(() => new Error(mensagem));
  }

  validarCpfCnpj(cpfCnpj: string): Observable<{ valido: boolean }> {
    return this.http.post<{ valido: boolean }>(`${this.apiUrl}/validar-cpf-cnpj`, { cpfCnpj });
  }
}