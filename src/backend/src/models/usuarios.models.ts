import { EmailDiarioUser, StatusUser } from "@prisma/client";

export interface Usuario {
    data: any;
    id?: number;
    nome: string;
    email: string;
    status: StatusUser;
    gestor: string;
    telefone: string;
    celular: string;
    administrador: string;
    emailDiario: EmailDiarioUser;
    criadoPor: string;
    alteradoPor: string;
    dataCriacao?: Date;
    dataAlteracao?: Date;
}