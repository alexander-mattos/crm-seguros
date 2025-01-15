export enum TipoContato {
    telefone = "1",
    responsável = "2",
    conjuge = "3",
    representante = "4",
    email = "5",
    fax = "6",
    funcionário = "7",
    socio = "8"
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
        { value: '1', label: 'Telefone', dbValue: TipoContato.telefone },
        { value: '2', label: 'Responsável', dbValue: TipoContato.responsável },
        { value: '3', label: 'Conjuge', dbValue: TipoContato.conjuge },
        { value: '4', label: 'Representante', dbValue: TipoContato.representante },
        { value: '5', label: 'E-Mail', dbValue: TipoContato.email },
        { value: '6', label: 'Fax', dbValue: TipoContato.fax },
        { value: '7', label: 'Funcionário', dbValue: TipoContato.funcionário },
        { value: '8', label: 'Sócio', dbValue: TipoContato.socio }
    ]
} as const;