export enum TipoContato {
    Telefone = '1',
    Responsável = '2',
    Conjuge = '3',
    Representante = '4',
    EMail = '5',
    Fax = '6',
    Funcionário = '7',
    Sócio = '8',
  }
  
  export interface IContato {
    id?: number;
    clienteId: number;
    tipo: TipoContato;
    nome: string;
    sexo?: string;
    cargo?: string;
    tratamento?: string;
    email?: string;
    dtNascimento?: string;
    cpf?: string;
    telefone?: string;
    celular?: string;
  }
  
  export interface IContatoForm {
    tipo: TipoContato;
    nome: string;
    sexo?: string;
    cargo?: string;
    tratamento?: string;
    email?: string;
    dtNascimento?: string;
    cpf?: string;
    telefone?: string;
    celular?: string;
  }
  
  export const FORM_OPTIONS_CONTATOS = {
    TipoContato: [
      { value: '1', label: 'Telefone', dbValue: TipoContato.Telefone },
      { value: '2', label: 'Responsável', dbValue: TipoContato.Responsável },
      { value: '3', label: 'Conjuge', dbValue: TipoContato.Conjuge },
      { value: '4', label: 'Representante', dbValue: TipoContato.Representante },
      { value: '5', label: 'EMail', dbValue: TipoContato.EMail },
      { value: '6', label: 'Fax', dbValue: TipoContato.Fax },
      { value: '7', label: 'Funcionário', dbValue: TipoContato.Funcionário },
      { value: '8', label: 'Sócio', dbValue: TipoContato.Sócio }
    ]
  } as const;