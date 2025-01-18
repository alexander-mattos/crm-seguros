
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppError } from './error';

const SEXO_VALUES = ['M', 'F'] as const;
const ESTADO_CIVIL_VALUES = ['1', '2', '3', '4', '5', '6', '7'] as const;
const ORIGEM_VALUES = ['1', '2', '3', '4', '5', '6', '7', '99'] as const;
const NR_FUNCIONARIOS_VALUES = ['1', '2', '3', '4', '5', '6'] as const;

const clienteSchema = z.object({
  nome: z.string()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(50, "Nome deve ter no máximo 50 caracteres"),

  tipoPessoa: z.enum(['F', 'J']),
  status: z.string(),
  origem: z.enum(ORIGEM_VALUES)
    .nullable()
    .optional(),
    sexo: z.enum(SEXO_VALUES)
    .nullable()
    .optional(),
    estadoCivil: z.enum(ESTADO_CIVIL_VALUES)
    .nullable()
    .optional(),
    nrFuncionarios: z.enum(NR_FUNCIONARIOS_VALUES)
    .nullable()
    .optional(),
    responsavel: z.string().max(30).nullable().optional(),
  lgpd: z.enum(['S', 'N'], {
    required_error: "LGPD é obrigatório",
    invalid_type_error: "LGPD deve ser 'S' ou 'N'"
  }),

  // Campos opcionais
  nomeSocial: z.string().max(30).nullable().optional(),
  cnpjCpf: z.string().max(14).nullable().optional(),
  email: z.string().email("Email inválido").max(70).nullable().optional().or(z.literal('')),
  site: z.string().max(100).nullable().optional(),
  faturamento: z.union([
    z.string(),
    z.number().transform(n => n.toString()),
    z.null(),
  ]).optional(),
  atividade: z.string().max(100).nullable().optional(),
  cep: z.string().max(8).nullable().optional(),
  endereco: z.string().max(100).nullable().optional(),
  numero: z.string().max(6).nullable().optional(),
  complemento: z.string().max(30).nullable().optional(),
  bairro: z.string().max(30).nullable().optional(),
  cidade: z.string().max(20).nullable().optional(),
  estado: z.string().max(2).nullable().optional(),
  unidadeNegocio: z.string().max(5).nullable().optional(),
  instagram: z.string().max(100).nullable().optional(),
  facebook: z.string().max(100).nullable().optional(),
  clienteDesde: z.string().nullable().optional(),
  dtNascimento: z.string().nullable().optional(),
  dtExpedicao: z.string().nullable().optional(),
  emissor: z.string().max(10).nullable().optional(),
  cnh: z.string().max(20).nullable().optional(),
  emissorCnh: z.string().max(10).nullable().optional(),
  dtvencCnh: z.string().nullable().optional(),
  conjuge: z.string().max(40).nullable().optional(),
  rg: z.string().max(20).nullable().optional()
});

export const validateClienteMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = clienteSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map(e => {
        const field = e.path.join('.');
        return `${field}: ${e.message}`;
      }).join(', ');

      throw new AppError(`Dados inválidos: ${messages}`, 400);
    }
    next(error);
  }
};

export const validateTelefoneMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = telefoneSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map(e => {
        const field = e.path.join('.');
        return `${field}: ${e.message}`;
      }).join(', ');

      throw new AppError(`Dados inválidos: ${messages}`, 400);
    }
    next(error);
  }
};

const telefoneSchema = z.object({
  tipo: z.enum(['1', '2', '4', '5']),
  numero: z.string()
    .min(10, "Telefone deve ter no mínimo 10 dígitos")
    .max(11, "Telefone deve ter no máximo 11 dígitos")
    .regex(/^\d+$/, "Telefone deve conter apenas números"),
  ramal: z.string().max(10).nullable().optional(),
  contato: z.string().max(50).nullable().optional()
});

export const validateEnderecoMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = enderecoSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map(e => {
        const field = e.path.join('.');
        return `${field}: ${e.message}`;
      }).join(', ');

      throw new AppError(`Dados inválidos: ${messages}`, 400);
    }
    next(error);
  }
};

const enderecoSchema = z.object({
  tipo: z.enum(['1', '2', '3', '4', '5', '6']),
  cep: z.string().max(8),
  endereco: z.string().max(100),
  numero: z.string().max(10),
  complemento: z.string().max(10).nullable().optional(),
  bairro: z.string().max(50),
  cidade: z.string().max(30),
  estado: z.string().max(2),
  correspondencia: z.string().max(10).nullable().optional(),
  aoscuidados: z.string().max(30).nullable().optional(),
});

export const validateContatosMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = contatoSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map(e => {
        const field = e.path.join('.');
        return `${field}: ${e.message}`;
      }).join(', ');

      throw new AppError(`Dados inválidos: ${messages}`, 400);
    }
    next(error);
  }
};

const contatoSchema = z.object({
  tipo: z.enum(['1', '2', '3', '4', '5', '6', '7', '8']),
  nome: z.string().max(100),
  sexo: z.string().max(15),
  cargo: z.string().max(10).nullable().optional(),
  tratamento: z.string().max(50).nullable().optional(),
  email: z.string().email("Email inválido").max(70).nullable().optional().or(z.literal('')),
  dtNascimento: z.string().max(8).nullable().optional(),
  cpf: z.string().max(11).nullable().optional(),
  telefone: z.string().max(10).nullable().optional(),
  celular: z.string().max(11).nullable().optional(),
});

export const validateNotasMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = notaSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map(e => {
        const field = e.path.join('.');
        return `${field}: ${e.message}`;
      }).join(', ');

      throw new AppError(`Dados inválidos: ${messages}`, 400);
    }
    next(error);
  }
};

const notaSchema = z.object({
  content: z.string().max(200)
});

export const validateLeadsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = leadsSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map(e => {
        const field = e.path.join('.');
        return `${field}: ${e.message}`;
      }).join(', ');

      throw new AppError(`Dados inválidos: ${messages}`, 400);
    }
    next(error);
  }
};

const leadsSchema = z.object({
  status: z.string().max(20),
  origem: z.string().max(20).nullable().optional(),
  nome: z.string().max(100),
  empresa: z.string().max(100).nullable().optional(),
  atividade: z.string().max(100).nullable().optional(),
  telcomercial: z.string().max(11).nullable().optional(),
  cpfCnpj: z.string().max(14).nullable().optional(),
  telresidencial: z.string().max(11).nullable().optional(),
  celular: z.string().max(11).nullable().optional(),
  tipoPessoa: z.string().max(8).nullable().optional(),
  setor: z.string().max(10).nullable().optional(),
  email: z.string().email("Email inválido").max(70).nullable().optional().or(z.literal('')),
  site: z.string().max(100).nullable().optional(),
  cep: z.string().max(9).nullable().optional(),
  endereco: z.string().max(100).nullable().optional(),
  numero: z.string().max(11).nullable().optional(),
  complemento: z.string().max(100).nullable().optional(),
  bairro: z.string().max(30).nullable().optional(),
  cidade: z.string().max(20).nullable().optional(),
  estado: z.string().max(2).nullable().optional(),
  receita: z.string().max(20).nullable().optional(),
  nrFuncionarios: z.string().max(20).nullable().optional(),
  descricao: z.string().max(100).nullable().optional(),
});