
export interface Produto {
    id: number;
    nome: string;
    codigo: string;
    descricao?: string;
    ativo: boolean;
    ramoId: number;
    iof?: number;
  }