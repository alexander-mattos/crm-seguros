export interface Produtos {
    id?: number;
    nome: string;
    codigo: string;
    descricao?: string;
    ativo: boolean;
    exibirNoOrcamento: boolean;
    seguradoraId: number;
    ramoId: number;
    comissaoSobreAdicional?: boolean;
    iof?: number;
    seguroPorAssinatura?: boolean;
    valorPrimeira?: number | string;
    valorDemais?: number | string;
    questionarioDeVenda?: string;
    createdAt?: Date;
    updatedAt?: Date;
    seguradora?: { id: number; nome: string; };
    ramo?: { id: number; nome: string; };
}

// Interface para dados formatados que serão enviados para o Prisma
export interface ProdutoFormatado {
    nome: string;
    codigo: string;
    descricao?: string;
    ativo: boolean;
    exibirNoOrcamento: boolean;
    seguradoraId: number;
    ramoId: number;
    comissaoSobreAdicional: boolean;
    iof: number;
    seguroPorAssinatura: boolean;
    valorPrimeira: number;
    valorDemais: number;
    questionarioDeVenda?: string;
    createdAt?: Date;
    updatedAt?: Date;
}