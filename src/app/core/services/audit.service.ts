import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";


@Injectable({
    providedIn: 'root'
  })
  
  export class AuditService {
    constructor(private http: HttpClient) {}

    registrarAlteracao(entidade: string, id: number, campo: string, valorAntigo: any, valorNovo: any): Observable<any> {
      const payload = {
        entidade,
        entidadeId: id,
        campo,
        valorAntigo: JSON.stringify(valorAntigo),
        valorNovo: JSON.stringify(valorNovo),
        dataAlteracao: new Date()
      };
  
      return this.http.post('/api/audit', payload);
    }
  }