import { Injectable } from '@angular/core';
import { environment } from '../../../../../backend/src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usuario } from '../../../../../backend/src/models/usuarios.models';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = `${environment.apiUrl}/configuracoes/usuarios`;

  constructor(private http: HttpClient) { }

  criarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/incluir`, usuario);
  }

  listarUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  listarUltimosUsuarios(limite: number = 5): Observable<Usuario[]> {
    const params = new HttpParams().set('limite', limite.toString());
    return this.http.get<{ success: boolean, data: Usuario[] }>(this.apiUrl, { params }).pipe(
      map(response => response.data)
    );
  }

  obterUsuarioPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  atualizarUsuario(id: number, usuario: Partial<Usuario>): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario);
  }

  excluirUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}