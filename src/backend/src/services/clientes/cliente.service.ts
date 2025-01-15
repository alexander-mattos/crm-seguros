
import { PrismaClient, Prisma } from '@prisma/client';
import { ICliente, IClienteCreate, IClienteUpdate } from '../../shared/types/cliente.types';
import { AppError } from '../../middlewares/error';

export class ClienteService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  private toDate(value: string | null | undefined): Date | null {
    if (!value) return null;
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }

  private toDecimal(value: string | number | null | undefined): Prisma.Decimal | null {
    // Se o valor for null, undefined ou string vazia, retorna null
    if (value === null || value === undefined || value === '') {
      return null;
    }

    try {
      // Se já for um número, converte direto para Decimal
      if (typeof value === 'number') {
        return new Prisma.Decimal(value);
      }

      // Se for string, remove formatação de moeda
      const numberStr = value.toString()
        .replace(/[R$\s.]/g, '')  // Remove R$, espaços e pontos
        .replace(',', '.');        // Troca vírgula por ponto

      // Verifica se o resultado é um número válido
      if (isNaN(Number(numberStr))) {
        return null;
      }

      return new Prisma.Decimal(numberStr);
    } catch (error) {
      console.error('Erro ao converter valor para decimal:', error);
      return null;
    }
  }

  // Função auxiliar para formatar data em string ISO
  private formatDate(date: Date | null): string | null {
    if (!date) return null;
    try {
      return date.toISOString();
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return null;
    }
  }

  // Função auxiliar para converter string de data para Date
  private parseDate(dateStr: string | null | undefined): string | null {
    if (!dateStr) return null;

    try {
      // Verifica se a data está no formato dd/mm/yyyy
      const brFormat = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      if (brFormat.test(dateStr)) {
        const [, day, month, year] = dateStr.match(brFormat) || [];
        const date = new Date(`${year}-${month}-${day}`);
        return isNaN(date.getTime()) ? null : this.formatDate(date);
      }

      // Tenta converter a data diretamente
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? null : this.formatDate(date);
    } catch (error) {
      console.error('Erro ao converter data:', error);
      return null;
    }
  }

  async create(data: Omit<IClienteCreate, 'id' | 'dtInclusao' | 'dtAlteracao'>) {
    try {
      const clienteData: Prisma.ClienteCreateInput = {
        nome: data.nome,
        nomeSocial: data.nomeSocial || null,
        tipoPessoa: data.tipoPessoa,
        cnpjCpf: data.cnpjCpf || null,
        status: data.status,
        origem: data.origem,
        responsavel: data.responsavel,
        email: data.email || null,
        site: data.site || null,
        faturamento: this.toDecimal(data.faturamento),
        atividade: data.atividade || null,
        nrFuncionarios: data.nrFuncionarios || null,
        unidadeNegocio: data.unidadeNegocio || null,
        instagram: data.instagram || null,
        facebook: data.facebook || null,
        lgpd: data.lgpd,
        clienteDesde: data.clienteDesde,
        dtNascimento: this.parseDate(data.dtNascimento),
        dtExpedicao: this.parseDate(data.dtExpedicao),
        emissor: data.emissor || null,
        cnh: data.cnh || null,
        emissorCnh: data.emissorCnh || null,
        dtvencCnh: this.parseDate(data.dtvencCnh),
        estadoCivil: data.estadoCivil || null,
        conjuge: data.conjuge || null,
        sexo: data.sexo || null,
        rg: data.rg || null
      };

      console.log('Dados formatados para criação:', {
        ...clienteData,
        dtNascimento: clienteData.dtNascimento,
        dtExpedicao: clienteData.dtExpedicao,
        dtvencCnh: clienteData.dtvencCnh
      });

      return await this.prisma.cliente.create({
        data: clienteData
      });
    } catch (error) {
      console.error('Erro detalhado:', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new AppError('Já existe um cliente com este CPF/CNPJ', 400);
        }
      }
      throw new AppError(`Erro ao criar cliente: ${error}`, 400);
    }
  }

  async findAll(queryParams?: {
    nome?: string;
    nomeSocial?: string;
    tipoPessoa?: string;
    unidadeNegocio?: string;
    status?: string;
    limite?: number;
  }) {
    try {
      const where: any = {};

      // Aplicando filtros
      if (queryParams?.nome) {
        where.nome = { contains: queryParams.nome };
      }

      if (queryParams?.nomeSocial) {
        where.nomeSocial = { contains: queryParams.nomeSocial };
      }

      if (queryParams?.tipoPessoa && queryParams.tipoPessoa !== '0') {
        where.tipoPessoa = queryParams.tipoPessoa;
      }

      if (queryParams?.status && queryParams.status !== 'TODOS') {
        where.status = queryParams.status;
      }

      if (queryParams?.unidadeNegocio && queryParams.unidadeNegocio !== '0') {
        where.unidadeNegocio = queryParams.unidadeNegocio;
      }

      const clientes = await this.prisma.cliente.findMany({
        where,
        take: queryParams?.limite ? Number(queryParams.limite) : undefined,
        orderBy: {
          dtInclusao: 'desc'
        }
      });

      return clientes;
    } catch (error) {
      throw new AppError(`Erro ao listar clientes: ${error}`, 500);
    }
  }

  async findById(id: number) {
    try {
      const cliente = await this.prisma.cliente.findUnique({
        where: { id }
      });

      if (!cliente) {
        throw new AppError('Cliente não encontrado', 404);
      }

      return cliente;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(`Erro ao buscar cliente: ${error}`, 500);
    }
  }

  async update(id: number, data: Partial<Omit<IClienteUpdate, 'id' | 'dtInclusao' | 'dtAlteracao'>>) {
    try {
      const updateData: Prisma.ClienteUpdateInput = {
        nome: data.nome !== undefined ? data.nome : undefined,
        nomeSocial: data.nomeSocial !== undefined ? data.nomeSocial : undefined,
        tipoPessoa: data.tipoPessoa !== undefined ? data.tipoPessoa : undefined,
        cnpjCpf: data.cnpjCpf !== undefined ? data.cnpjCpf : undefined,
        status: data.status !== undefined ? data.status : undefined,
        origem: data.origem !== undefined ? data.origem : undefined,
        responsavel: data.responsavel !== undefined ? data.responsavel : undefined,
        email: data.email !== undefined ? data.email : undefined,
        sexo: data.sexo !== undefined ? data.sexo : undefined,
        rg: data.rg !== undefined ? data.rg : undefined,
        emissor: data.emissor !== undefined ? data.emissor : undefined,
        cnh: data.cnh !== undefined ? data.cnh : undefined,
        emissorCnh: data.emissorCnh !== undefined ? data.emissorCnh : undefined,
        estadoCivil: data.estadoCivil !== undefined ? data.estadoCivil : undefined,
        conjuge: data.conjuge !== undefined ? data.conjuge : undefined,
        nrFuncionarios: data.nrFuncionarios !== undefined ? data.nrFuncionarios : undefined,
        unidadeNegocio: data.unidadeNegocio !== undefined ? data.unidadeNegocio : undefined,
        instagram: data.instagram !== undefined ? data.instagram : undefined,
        facebook: data.facebook !== undefined ? data.facebook : undefined,
        lgpd: data.lgpd !== undefined ? data.lgpd : undefined,
        site: data.site !== undefined ? data.site : undefined,
        faturamento: data.faturamento !== undefined ? this.toDecimal(data.faturamento) : undefined,
        atividade: data.atividade !== undefined ? data.atividade : undefined,
        clienteDesde: data.clienteDesde !== undefined ? data.clienteDesde : undefined,
        dtNascimento: data.dtNascimento !== undefined ? this.toDate(data.dtNascimento) : undefined,
        dtExpedicao: data.dtExpedicao !== undefined ? this.toDate(data.dtExpedicao) : undefined,
        dtvencCnh: data.dtvencCnh !== undefined ? this.toDate(data.dtvencCnh) : undefined,
        dtAlteracao: new Date(),
      };

      return await this.prisma.cliente.update({
        where: { id },
        data: updateData
      });
    } catch (error) {
      console.error('Erro detalhado:', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new AppError('Já existe um cliente com este CPF/CNPJ', 400);
        }
        if (error.code === 'P2025') {
          throw new AppError('Cliente não encontrado', 404);
        }
      }
      throw new AppError(`Erro ao atualizar cliente: ${error}`, 400);
    }
  }

  async delete(id: number) {
    try {
      return await this.prisma.cliente.delete({
        where: { id }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new AppError('Cliente não encontrado', 404);
        }
      }
      throw new AppError(`Erro ao excluir cliente: ${error}`, 500);
    }
  }
}