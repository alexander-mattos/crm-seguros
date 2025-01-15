import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
  export class DocumentoService {
    validarCPF(cpf: string): boolean {
      // Implementar validação de CPF
    }
  
    validarCNPJ(cnpj: string): boolean {
      // Implementar validação de CNPJ
    }
  }