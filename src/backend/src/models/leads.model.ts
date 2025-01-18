export interface Lead {
    id?: number;
    status: string;
    origem?: string;
    nome: string;
    empresa?: string;
    atividade?: string;
    celular?: string;
    telcomercial?: string;
    telresidencial?: string;
    tipoPessoa?: string;
    cpfCnpj?: string;
    setor?: string;
    email?: string;
    site?: string;
    cep?: string;
    endereco?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    receita?: string;
    nrFuncionarios?: string;
    descricao?: string;
    createdAt?: Date;
    updatedAt?: Date;
}