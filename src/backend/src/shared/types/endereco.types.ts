export enum TipoEndereco {
  RESIDENCIAL = '1',
  COMERCIAL = '2',
  COBRANÇA = '3',
  FILIAL = '4',
  ANTIGO = '5',
  VERANEIO = '6'
}

export interface IEndereco {
  id?: number;
  clienteId: number;
  tipo: TipoEndereco;
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

export interface IEnderecoForm {
  tipo: TipoEndereco;
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

export const FORM_OPTION = {
  tipoEndereco: [
    { value: '1', label: 'RESIDENCIAL', dbValue: TipoEndereco.RESIDENCIAL },
    { value: '2', label: 'COMERCIAL', dbValue: TipoEndereco.COMERCIAL },
    { value: '3', label: 'COBRANÇA', dbValue: TipoEndereco.COBRANÇA },
    { value: '4', label: 'FILIAL', dbValue: TipoEndereco.FILIAL },
    { value: '5', label: 'ANTIGO', dbValue: TipoEndereco.ANTIGO },
    { value: '6', label: 'VERANEIO', dbValue: TipoEndereco.VERANEIO }
  ]
} as const;