

export interface Cliente {
    id?: number;
    nome: string;
    nomeSocial?: string | null;
    tipoPessoa: 'Física' | 'Jurídica';
    cnpjCpf?: string | null;
    status: 'CLIENTE' | 'INATIVO' | 'NÃO INFORMADO' | 'PARCEIRO' | 'PROSPECT';
    clienteDesde?: string | null;
    dtInclusao?: Date | null;
    dtAlteracao?: Date | null;
    dtNascimento?: string | null;
    sexo?: 'Masculino' | 'Feminino' | null;
    rg?: string | null;
    dtExpedicao?: string | null;
    emissor?: string | null;
    cnh?: string | null;
    emissorCnh?: string | null;
    dtvencCnh?: string | null;
    estadoCivil?: 'Casado(a)' | 'Viúvo(a)' | 'Desquitado(a)' | 'Solteiro(a)' | 'Divorciado(a)' | 'Separado(a)' | 'União Estável' | null;
    conjuge?: string | null;
    origem: '0' | 'INTERNET' | 'TELEFONE' | 'INDICAÇÃO' | 'ANÚNCIO' | 'INSTAGRAM' | 'FACEBOOK' | 'GOOGLE' | 'OUTROS';
    responsavel: string;
    email?: string | null;
    telefone?: string | null;
    site?: string | null;
    faturamento?: string | null;
    atividade?: string | null;
    cep?: string | null;
    endereco?: string | null;
    numero?: string | null;
    complemento?: string | null;
    bairro?: string | null;
    cidade?: string | null;
    estado?: string | null;
    
    /** Número de funcionários (0-Selecione, 1-200 a 500, 2-500 a 1000, 3-1000 a 3000, 4-até 200, 5-3000 a 5000, 6-+5000) */
    nrFuncionarios?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | null;
    unidadeNegocio?: string | null;
    instagram?: string | null;
    facebook?: string | null;
    lgpd: 'S' | 'N';
}

/** DTO para criação de cliente */
export type ClienteCreateDTO = Omit<Cliente, 'id' | 'dtInclusao' | 'dtAlteracao'>;

/** DTO para atualização de cliente */
export type ClienteUpdateDTO = Partial<ClienteCreateDTO>;

/** Tipo para resposta da API */
export interface ApiResponse<T> {
    status: 'success' | 'error';
    data?: T;
    message?: string;
    statusCode?: number;
}