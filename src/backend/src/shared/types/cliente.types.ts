import { ITelefone } from './telefone.types';
import { IEndereco } from './endereco.types';


export enum TipoPessoa {
  FISICA = 'FÍSICA',
  JURIDICA = 'JURÍDICA'
}

export enum StatusCliente {
  CLIENTE = 'CLIENTE',
  PROSPECT = 'PROSPECT',
  PARCEIRO = 'PARCEIRO',
  INATIVO = 'INATIVO',
  NAO_INFORMADO = 'NÃO INFORMADO'
}

export enum Sexo {
  MASCULINO = 'MASCULINO',
  FEMININO = 'FEMININO'
}

export enum EstadoCivil {
  CASADO = 'CASADO(a)',
  VIUVO = 'VIÚVO(a)',
  DESQUITADO = 'DESQUITADO(a)',
  SOLTEIRO = 'SOLTEIRO(a)',
  DIVORCIADO = 'DIVORCIADO(a)',
  SEPARADO = 'SEPARADO(a)',
  UNIAO_ESTAVEL = 'UNIÃO ESTÁVEL'
}

export enum NrFuncionarios {
  ATE_200 = 'até 200',
  DE_200_500 = 'de 200 a 500',
  DE_500_1000 = 'de 500 a 1000',
  DE_1000_3000 = 'de 1000 a 3000',
  DE_3000_5000 = 'de 3000 a 5000',
  MAIS_5000 = '+ de 5000'
}

export enum Origem {
  INTERNET = 'INTERNET',
  TELEFONE = 'TELEFONE',
  INDICACAO = 'INDICAÇÃO',
  ANUNCIO = 'ANÚNCIO',
  INSTAGRAM = 'INSTAGRAM',
  FACEBOOK = 'FACEBOOK',
  GOOGLE = 'GOOGLE',
  OUTROS = 'OUTROS'
}

// Interface base do Cliente
export interface ICliente {
  id?: number;
  nome: string;
  nomeSocial?: string | null;
  tipoPessoa: TipoPessoa;
  cnpjCpf?: string | null;
  status: StatusCliente;
  origem?: Origem | null;
  unidadeNegocio?: string | null;
  responsavel?: string | null;
  clienteDesde?: string | null;
  email?: string | null;
  site?: string | null;
  faturamento?: string | null;
  atividade?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  nrFuncionarios?: NrFuncionarios | null;
  dtNascimento?: string | null;
  sexo?: Sexo | null;
  rg?: string | null;
  dtExpedicao?: string | null;
  emissor?: string | null;
  cnh?: string | null;
  emissorCnh?: string | null;
  dtvencCnh?: string | null;
  estadoCivil?: EstadoCivil | null;
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

export interface IClienteExibicao extends ICliente {
  tipoPessoaFormatado?: string;
  statusFormatado?: string;
  sexoFormatado?: string;
  dtNascimentoFormatado?: string;
  dtExpedicaoFormatado?: string;
  dtvencCnhFormatado?: string;
  dtInclusaoFormatado?: string;
  dtAlteracaoFormatado?: string;
  clienteDesdeFormatado?: string;
}

// Interface para criar cliente (omite campos automáticos)
export type IClienteCreate = Omit<ICliente, 'id' | 'dtInclusao' | 'dtAlteracao'>;

// Interface para atualizar cliente (todos os campos são opcionais exceto id)
export type IClienteUpdate = Partial<IClienteCreate> & { id: number };

// Tipo para o formulário (usando strings para campos de data e enum)
export interface IClienteForm {
  // ... similar ao ICliente mas com tipos adaptados para formulário
  dtNascimento?: string;
  dtExpedicao?: string;
  dtvencCnh?: string;
  tipoPessoa: string;
  status: string;
  // ... outros campos
}

export interface IClienteQueryParams {
  nome?: string;
  nomeSocial?: string;
  tipoPessoa?: string;
  unidadeNegocio?: string;
  status?: string;
  limite?: number;
}

// Mapeamentos para select/combos do formulário
export const FORM_OPTIONS = {
  tipoPessoa: [
    { value: 'F', label: 'FÍSICA', dbValue: TipoPessoa.FISICA },
    { value: 'J', label: 'JURÍDICA', dbValue: TipoPessoa.JURIDICA }
  ],
  status: [
    { value: '1', label: 'CLIENTE', dbValue: StatusCliente.CLIENTE },
    { value: '2', label: 'PROSPECT', dbValue: StatusCliente.PROSPECT },
    { value: '3', label: 'PARCEIRO', dbValue: StatusCliente.PARCEIRO },
    { value: '4', label: 'NÃO INFORMADO', dbValue: StatusCliente.NAO_INFORMADO },
    { value: '8', label: 'INATIVO', dbValue: StatusCliente.INATIVO },
  ],
  sexo: [
    { value: 'M', label: 'MASCULINO', dbValue: Sexo.MASCULINO },
    { value: 'F', label: 'FEMININO', dbValue: Sexo.FEMININO }
  ],
  estadocivil: [
    { value: '1', label: 'CASADO(a)', dbValue: EstadoCivil.CASADO },
    { value: '2', label: 'VIÚVO(a)', dbValue: EstadoCivil.VIUVO },
    { value: '3', label: 'DESQUITADO(a)', dbValue: EstadoCivil.DESQUITADO },
    { value: '4', label: 'SOLTEIRO(a)', dbValue: EstadoCivil.SOLTEIRO },
    { value: '5', label: 'DIVORCIADO(a)', dbValue: EstadoCivil.DIVORCIADO },
    { value: '6', label: 'SEPARADO(a)', dbValue: EstadoCivil.SEPARADO },
    { value: '7', label: 'UNIÃO ESTÁVEL', dbValue: EstadoCivil.UNIAO_ESTAVEL },
  ],
  origem: [
    { value: '1', label: 'ANÚNCIO', dbValue: Origem.ANUNCIO },
    { value: '2', label: 'INDICAÇÃO', dbValue: Origem.INDICACAO },
    { value: '3', label: 'INTERNET', dbValue: Origem.INTERNET },
    { value: '4', label: 'TELEFONE', dbValue: Origem.TELEFONE },
    { value: '5', label: 'INSTAGRAM', dbValue: Origem.INSTAGRAM },
    { value: '6', label: 'FACEBOOK', dbValue: Origem.FACEBOOK },
    { value: '7', label: 'GOOGLE', dbValue: Origem.GOOGLE },
    { value: '99', label: 'OUTROS', dbValue: Origem.OUTROS },
  ],
  nrFuncionarios: [
    { value: '1', label: 'até 200', dbValue: NrFuncionarios.ATE_200 },
    { value: '2', label: 'de 200 a 500', dbValue: NrFuncionarios.DE_200_500 },
    { value: '3', label: 'de 500 a 1000', dbValue: NrFuncionarios.DE_500_1000 },
    { value: '4', label: 'de 1000 a 3000', dbValue: NrFuncionarios.DE_1000_3000 },
    { value: '5', label: 'de 3000 a 5000', dbValue: NrFuncionarios.DE_3000_5000 },
    { value: '6', label: '+ de 5000', dbValue: NrFuncionarios.MAIS_5000 },
  ],
} as const;

export interface IClienteImportacao {
  // Dados básicos do cliente
  nome: string;
  nomeSocial?: string;
  tipoPessoa: string;  // 'F' para física ou 'J' para jurídica
  cnpjCpf?: string;    // Opcional pois pode não estar disponível no momento da importação
  status?: string;     // Se não fornecido, usaremos 'CLIENTE' como padrão
  origem?: string;
  unidadeNegocio?: string;
  responsavel?: string;
  clienteDesde?: string;
  telefone?: string;
  email?: string;
  site?: string;

  // Dados financeiros e sociais
  faturamento?: number | string; // Aceitamos string para facilitar a importação de planilhas
  atividade?: string;
  instagram?: string;
  facebook?: string;

  // Dados específicos para Pessoa Jurídica
  nrFuncionarios?: string;

  // Dados específicos para Pessoa Física
  dtNascimento?: string | Date;
  sexo?: string;
  rg?: string;
  dtExpedicao?: string | Date;
  emissor?: string;
  cnh?: string;
  emissorCnh?: string;
  dtvencCnh?: string | Date;
  estadoCivil?: string;
  conjuge?: string;

  // Relacionamentos - Arrays de telefones e endereços
  telefones: ITelefone[];
  enderecos: IEndereco[];

  // Campos de controle
  lgpd?: string;       // 'S' ou 'N', com default 'S'
  dtInclusao?: Date;   // Será preenchida automaticamente se não fornecida
  dtAlteracao?: Date;  // Atualizada automaticamente pelo Prisma

  // Campos de controle da importação
  selecionado?: boolean; // Usado na interface para selecionar registros para importação
  valido?: boolean;      // Indica se o registro passou nas validações
}

// Interface para respostas de sucesso na importação
export interface IImportacaoSucesso {
  sucesso: true;
  clienteId: number;
  mensagem: string;
}

// Interface para respostas de erro na importação
export interface IImportacaoErro {
  sucesso: false;
  clienteNome: string;
  mensagem: string;
  erro: string;
}

// Tipo que representa qualquer resultado possível da importação
export type ResultadoImportacao = IImportacaoSucesso | IImportacaoErro;

// Interface para a resposta completa da importação
export interface IRespostaImportacao {
  sucesso: boolean;
  resultados: ResultadoImportacao[];
}