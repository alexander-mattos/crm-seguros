
export interface ITelefoneImportacao {
  tipo: string;        // 1-Residencial, 2-Comercial, 4-Celular, 5-Fax
  numero: string;
  ramal?: string;
  contato?: string;
}

export interface IEnderecoImportacao {
  tipo: string;        // Define o tipo do endereço (Residencial, Comercial, etc)
  cep: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  correspondencia?: string;
  aoscuidados?: string;
}

export interface IClienteImportacao {
  // Propriedade de controle para a interface
  selecionado?: boolean;
  valido?: boolean;

  // Dados básicos do cliente
  nome: string;
  nomeSocial?: string;
  tipoPessoa: string;  // F ou J
  cnpjCpf?: string;
  status: string;
  origem?: string;
  unidadeNegocio?: string;
  responsavel?: string;
  clienteDesde?: string;
  email?: string;
  site?: string;
  
  // Dados financeiros e sociais
  faturamento?: number;
  atividade?: string;
  instagram?: string;
  facebook?: string;
  
  // Dados específicos para Pessoa Jurídica
  nrFuncionarios?: string;
  
  // Dados específicos para Pessoa Física
  dtNascimento?: string;
  sexo?: string;
  rg?: string;
  dtExpedicao?: string;
  emissor?: string;
  cnh?: string;
  emissorCnh?: string;
  dtvencCnh?: string;
  estadoCivil?: string;
  conjuge?: string;
  
  // Dados de controle
  lgpd?: string;
  
  // Arrays para dados relacionados
  telefones: ITelefoneImportacao[];
  enderecos: IEnderecoImportacao[];
}