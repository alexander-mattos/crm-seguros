// Interface base do Cliente
export interface ILeads {
  id?: number;
  nome: string;
  nomeSocial?: string | null;
  cnpjCpf?: string | null;
  status: string | null;
  origem?: string | null;
  unidadeNegocio?: string | null;
  responsavel?: string | null;
  clienteDesde?: string | null;
  email?: string | null;
  site?: string | null;
  faturamento?: string | null;
  atividade?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  nrFuncionarios?: string | null;
  dtNascimento?: string | null;
  sexo?: string | null;
  rg?: string | null;
  dtExpedicao?: string | null;
  emissor?: string | null;
  cnh?: string | null;
  emissorCnh?: string | null;
  dtvencCnh?: string | null;
  estadoCivil?: string | null;
  conjuge?: string | null;
  cep?: string | null;
  endereco?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  estado?: string | null;
  lgpd: 'S' | 'N';
  dtInclusao?: string | null;
  dtAlteracao?: string | null;
}