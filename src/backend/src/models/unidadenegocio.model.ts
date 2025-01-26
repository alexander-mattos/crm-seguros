export interface UnidadeNegocio {
    nome: string;
    responsavel?: string;
    susep?: string;
    email?: string;
    cep?: string;
    endereco?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    telefone1?: string;
    telefone2?: string;
    celular?: string;
    dataCriacao: Date;
    dataAlteracao: Date
}