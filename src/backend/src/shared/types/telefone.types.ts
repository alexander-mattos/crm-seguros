export enum TipoTelefone {
    RESIDENCIAL = '1',
    COMERCIAL = '2',
    FAX = '5',
    CELULAR = '4'
  }
  
  export interface ITelefone {
    id?: number;
    clienteId: number;
    tipo: TipoTelefone;
    numero: string;
    ramal?: string | null;
    contato?: string | null;
  }
  
  export interface ITelefoneForm {
    tipo: string;
    numero: string;
    ramal?: string;
    contato?: string;
  }
  
  export const FORM_OPTIONS = {
    tipoTelefone: [
      { value: '1', label: 'Residencial', dbValue: TipoTelefone.RESIDENCIAL },
      { value: '2', label: 'Comercial', dbValue: TipoTelefone.COMERCIAL },
      { value: '4', label: 'Celular', dbValue: TipoTelefone.CELULAR },
      { value: '5', label: 'Fax', dbValue: TipoTelefone.FAX }
    ]
  } as const;