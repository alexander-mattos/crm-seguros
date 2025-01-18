

export interface AtividadeLead {
  id: number;
  leadId: number;
  nome?: string;
  tipo: string;
  assunto: string;
  descricao: string;
  data: Date;
  hora: string;
  local?: string;
  responsavel: string;
  oportunidade:string;
  departamento: string;
  status: string;
  referente: string;
  resultado?: string;
  concluida: string;
  dtConclusao?: Date;
  recorrente?: string;
  criadoPor: string;
  dtInclusao: Date;
  dtAlteracao: Date;
  createdAt: Date;
  updatedAt: Date;
  nomeLead?: string;
}
  
  export interface AtividadeLeadCreate extends Omit<AtividadeLead, 'id' | 'dtInclusao' | 'dtAlteracao' | 'criadoPor'> {
    id?: number;
    dtInclusao?: Date;
    dtAlteracao?: Date;
    criadoPor?: string;
  }
  
  export interface AtividadeUpdate extends Partial<AtividadeLeadCreate> {
    id: number;
  }

  export interface AtividadeLeadFiltro {
    tipoAtribuicao?: 'P' | 'D'; // P para Pessoa, D para Departamento
    atribuidoPara?: string;
    filtro?: 'H' | 'SA' | 'A' | 'S' | 'M' | 'T'; // Hoje, Somente Atrasadas, Amanhã, Esta Semana, Este Mês, Todas
  }