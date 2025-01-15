
interface ClienteAtividade {
  nome: string;
}

export interface Atividade {
  id: number;
  clienteId: number;
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
  clienteNome?: string;
  cliente?: ClienteAtividade;
}
  
  export interface AtividadeCreate extends Omit<Atividade, 'id' | 'dtInclusao' | 'dtAlteracao' | 'criadoPor'> {
    id?: number;
    dtInclusao?: Date;
    dtAlteracao?: Date;
    criadoPor?: string;
  }
  
  export interface AtividadeUpdate extends Partial<AtividadeCreate> {
    id: number;
  }

  export interface AtividadeFiltro {
    tipoAtribuicao?: 'P' | 'D'; // P para Pessoa, D para Departamento
    atribuidoPara?: string;
    filtro?: 'H' | 'SA' | 'A' | 'S' | 'M' | 'T'; // Hoje, Somente Atrasadas, Amanhã, Esta Semana, Este Mês, Todas
  }