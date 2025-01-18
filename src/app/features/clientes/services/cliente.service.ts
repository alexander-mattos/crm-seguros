
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, finalize } from 'rxjs/operators';
import { Cliente } from '../../../../backend/src/models';
import { environment } from '../../../../backend/src/environments/environment';
import { IClienteImportacao } from '@/app/shared/interfaces/cliente.interface';
import { ITelefoneImportacao } from '@/app/shared/interfaces/telefone.interface';
import { IEnderecoImportacao } from '@/app/shared/interfaces/endereco.interface';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = `${environment.apiUrl}/clientes`;

  constructor(private http: HttpClient) { }

  criarCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.apiUrl}/incluir`, cliente);
  }

  listarClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  listarClientesComFiltro(filtros: {
    nome?: string;
    nomeSocial?: string;
    tipoPessoa?: string;
    unidadeNegocio?: string;
    status?: string;
  }): Observable<Cliente[]> {
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

    return this.http.get<Cliente[]>(this.apiUrl, { params });
  }

  listarUltimosClientes(limite: number = 5): Observable<Cliente[]> {
    const params = new HttpParams().set('limite', limite.toString());
    return this.http.get<Cliente[]>(this.apiUrl, { params });
  }


  obterClientePorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  atualizarCliente(id: number, cliente: Partial<Cliente>): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/${id}`, cliente);
  }

  excluirCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Métodos adicionais que podem ser úteis
  buscarPorCpfCnpj(cpfCnpj: string): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/buscar`, {
      params: { cpfCnpj }
    });
  }

  buscarPorNome(nome: string): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/buscar`, {
      params: { nome }
    });
  }

  importarClientes(clientes: IClienteImportacao[]): Observable<any> {
    const clientesParaEnviar = clientes.map(cliente => {
      const { selecionado, valido, ...dadosCliente } = cliente;

      return {
        ...dadosCliente,
        status: dadosCliente.status || 'PROSPECT',
        telefones: (dadosCliente.telefones || []).map((tel: ITelefoneImportacao) => ({
          ...tel,
          numero: this.limparNumeroTelefone(tel.numero),
          tipo: tel.tipo || '1'
        })),
        enderecos: (dadosCliente.enderecos || []).map((end: IEnderecoImportacao) => ({
          ...end,
          cep: this.limparCep(end.cep),
          tipo: end.tipo || '1',
          correspondencia: end.correspondencia || 'N'
        }))
      };
    });

    return this.http.post(`${environment.apiUrl}/clientes/importar`, clientesParaEnviar)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
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