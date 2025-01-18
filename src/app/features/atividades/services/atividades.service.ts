import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../backend/src/environments/environment';
import { Atividade, AtividadeCreate, AtividadeUpdate, AtividadeFiltro } from '../../clientes/types/atividade.types';


@Injectable({
  providedIn: 'root'
})

export class AtividadeService {
  private apiUrl = `${environment.apiUrl}/atividades`;

  constructor(private http: HttpClient) { }

  criarAtividade(atividade: AtividadeCreate): Observable<Atividade> {
    console.log('Dados enviados para API:', atividade);

    // Garantindo que todos os campos necessários estejam presentes
    const dadosAtividade = {
      ...atividade,
      dtInclusao: new Date(),
      dtAlteracao: new Date(),
      criadoPor: 'Sistema'
    };

    return this.http.post<Atividade>(this.apiUrl, dadosAtividade)
      .pipe(
        catchError(error => {
          console.error('Erro na chamada da API:', error);
          throw error;
        })
      );
  }

  listarAtividades(filtros: AtividadeFiltro): Observable<Atividade[]> {

    return this.http.get<Atividade[]>(`${this.apiUrl}`, { params: { ...filtros } });

  }

  obterAtividade(id: number): Observable<Atividade> {
    return this.http.get<Atividade>(`${this.apiUrl}/${id}`);
  }

  atualizarAtividade(id: number, atividade: AtividadeUpdate): Observable<Atividade> {
    return this.http.put<Atividade>(`${this.apiUrl}/${id}`, atividade);
  }

  excluirAtividade(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  listarAtividadesPorCliente(clienteId: number): Observable<Atividade[]> {
    return this.http.get<Atividade[]>(`${this.apiUrl}/cliente/${clienteId}`);
  }

  // Métodos auxiliares
  obterTiposAtividade(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tipos`);
  }
}