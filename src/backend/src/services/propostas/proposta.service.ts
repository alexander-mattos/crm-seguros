
import { PrismaClient } from '@prisma/client';
import { Proposta } from '../models/proposta.model';
import { AppError } from '../middlewares/error';

export class PropostaService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(data: Omit<Proposta, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      // Criar a proposta com dados bancários em uma transação
      const result = await this.prisma.$transaction(async (tx) => {
        const proposta = await tx.proposta.create({
          data: {
            numero: data.numero,
            tipoDocumento: data.tipoDocumento,
            motivoEndosso: data.motivoEndosso,
            dataProposta: data.dataProposta,
            vigenciaInicio: data.vigenciaInicio,
            vigenciaFim: data.vigenciaFim,
            clienteId: data.clienteId,
            seguradoraId: data.seguradoraId,
            produtoId: data.produtoId,
            ramoId: data.ramoId,
            apoliceRenovadaId: data.apoliceRenovadaId,
            formaPagamento: data.formaPagamento,
            numeroParcelas: data.numeroParcelas,
            vencimentoPrimeira: data.vencimentoPrimeira,
            valorPrimeira: data.valorPrimeira,
            premioLiquido: data.premioLiquido,
            adicional: data.adicional,
            desconto: data.desconto,
            custoApolice: data.custoApolice,
            iof: data.iof,
            premioTotal: data.premioTotal,
            comissaoBase: data.comissaoBase,
            comissaoPercentual: data.comissaoPercentual,
            comissaoValor: data.comissaoValor,
            status: data.status,
            criadoPor: data.criadoPor
          }
        });

        if (data.dadosBancarios) {
          await tx.dadosBancarios.create({
            data: {
              propostaId: proposta.id,
              ...data.dadosBancarios
            }
          });
        }

        return proposta;
      });

      return result;
    } catch (error) {
      throw new AppError(`Erro ao criar proposta: ${error}`, 500);
    }
  }

  async findAll() {
    try {
      return await this.prisma.proposta.findMany({
        include: {
          cliente: true,
          seguradora: true,
          produto: true,
          ramo: true,
          dadosBancarios: true
        }
      });
    } catch (error) {
      throw new AppError(`Erro ao listar propostas: ${error}`, 500);
    }
  }

  async findById(id: number) {
    try {
      const proposta = await this.prisma.proposta.findUnique({
        where: { id },
        include: {
          cliente: true,
          seguradora: true,
          produto: true,
          ramo: true,
          dadosBancarios: true,
          parcelas: true,
          comissoes: true
        }
      });

      if (!proposta) {
        throw new AppError('Proposta não encontrada', 404);
      }

      return proposta;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(`Erro ao buscar proposta: ${error}`, 500);
    }
  }

  async update(id: number, data: Partial<Omit<Proposta, 'id' | 'createdAt' | 'updatedAt'>>) {
    try {
      // Primeiro verifica se a proposta existe
      const propostaExiste = await this.prisma.proposta.findUnique({
        where: { id }
      });

      if (!propostaExiste) {
        throw new AppError('Proposta não encontrada', 404);
      }

      // Atualiza a proposta e os dados bancários em uma transação
      const result = await this.prisma.$transaction(async (tx) => {
        const proposta = await tx.proposta.update({
          where: { id },
          data: {
            tipoDocumento: data.tipoDocumento,
            motivoEndosso: data.motivoEndosso,
            vigenciaInicio: data.vigenciaInicio,
            vigenciaFim: data.vigenciaFim,
            clienteId: data.clienteId,
            seguradoraId: data.seguradoraId,
            produtoId: data.produtoId,
            ramoId: data.ramoId,
            apoliceRenovadaId: data.apoliceRenovadaId,
            formaPagamento: data.formaPagamento,
            numeroParcelas: data.numeroParcelas,
            vencimentoPrimeira: data.vencimentoPrimeira,
            valorPrimeira: data.valorPrimeira,
            premioLiquido: data.premioLiquido,
            adicional: data.adicional,
            desconto: data.desconto,
            custoApolice: data.custoApolice,
            iof: data.iof,
            premioTotal: data.premioTotal,
            comissaoBase: data.comissaoBase,
            comissaoPercentual: data.comissaoPercentual,
            comissaoValor: data.comissaoValor,
            status: data.status,
            alteradoPor: data.alteradoPor
          }
        });

        // Atualiza ou cria dados bancários se fornecidos
        if (data.dadosBancarios) {
          await tx.dadosBancarios.upsert({
            where: {
              propostaId: id
            },
            update: data.dadosBancarios,
            create: {
              propostaId: id,
              ...data.dadosBancarios
            }
          });
        }

        return proposta;
      });

      return result;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(`Erro ao atualizar proposta: ${error}`, 500);
    }
  }

  async converterEmApolice(id: number) {
    try {
      // Busca a proposta com todos os relacionamentos necessários
      const proposta = await this.prisma.proposta.findUnique({
        where: { id },
        include: {
          dadosBancarios: true,
          parcelas: true,
          comissoes: true
        }
      });

      if (!proposta) {
        throw new AppError('Proposta não encontrada', 404);
      }

      if (proposta.status !== 'APROVADA') {
        throw new AppError('Proposta precisa estar aprovada para ser convertida em apólice', 400);
      }

      // Cria a apólice e atualiza a proposta em uma transação
      const result = await this.prisma.$transaction(async (tx) => {
        // Cria a apólice
        const apolice = await tx.apolice.create({
          data: {
            numero: `APL${proposta.numero}`,
            clienteId: proposta.clienteId,
            seguradoraId: proposta.seguradoraId,
            produtoId: proposta.produtoId,
            ramoId: proposta.ramoId,
            dataInicio: proposta.vigenciaInicio,
            dataFim: proposta.vigenciaFim,
            valorPremio: proposta.premioTotal,
            status: 'EMITIDA',
            propostaId: proposta.id
          }
        });

        // Atualiza o status da proposta
        await tx.proposta.update({
          where: { id },
          data: {
            status: 'CONVERTIDA'
          }
        });

        // Cria as parcelas da apólice baseadas nas parcelas da proposta
        if (proposta.parcelas.length > 0) {
          await tx.parcela.createMany({
            data: proposta.parcelas.map(parcela => ({
              ...parcela,
              apoliceId: apolice.id
            }))
          });
        }

        return apolice;
      });

      return result;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(`Erro ao converter proposta em apólice: ${error}`, 500);
    }
  }
}