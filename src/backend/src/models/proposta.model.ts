
export interface Proposta {
    id?: number;
    numero: string;
    tipoDocumento: 'A' | 'C' | 'D' | 'F' | 'I' | 'M' | 'R' | 'X';
    motivoEndosso?: string;
    dataProposta: Date;
    vigenciaInicio: Date;
    vigenciaFim: Date;
  
    // Relacionamentos
    clienteId: number;
    seguradoraId: number;
    produtoId: number;
    ramoId: number;
    apoliceRenovadaId?: number;
  
    // Pagamento
    formaPagamento: string;
    numeroParcelas: number;
    vencimentoPrimeira: Date;
    valorPrimeira?: number;
  
    // Valores
    premioLiquido: number;
    adicional?: number;
    desconto?: number;
    custoApolice?: number;
    iof?: number;
    premioTotal: number;
  
    // Comissão
    comissaoBase?: number;
    comissaoPercentual?: number;
    comissaoValor?: number;
  
    // Dados Bancários (opcional)
    dadosBancarios?: {
      banco: string;
      agencia: string;
      conta: string;
    };
  
    // Controle
    status: string;
    criadoPor: string;
    alteradoPor?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }