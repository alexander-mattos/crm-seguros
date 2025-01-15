export interface ITelefoneImportacao {
    tipo: string;        // 1-Residencial, 2-Comercial, 4-Celular, 5-Fax
    numero: string;
    ramal?: string;
    contato?: string;
  }