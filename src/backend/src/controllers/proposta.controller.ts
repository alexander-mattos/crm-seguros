import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

export class PropostaController {
  async criar(req: Request, res: Response) {
    try {
      const { clienteId, seguradoraId, produtoId, ramoId, ...dadosProposta } = req.body;

      const cliente = await prisma.cliente.findUnique({ where: { id: Number(clienteId) } });

      if (!cliente) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }

      const proposta = await prisma.proposta.create({
        data: {
          ...dadosProposta,
          cliente: { connect: { id: Number(clienteId) } },
          seguradora: { connect: { id: Number(seguradoraId) } },
          produto: { connect: { id: Number(produtoId) } },
          ramo: { connect: { id: Number(ramoId) } },
          dataProposta: new Date(dadosProposta.dataProposta),
          vigenciaInicio: new Date(dadosProposta.vigenciaInicio),
          vigenciaFim: new Date(dadosProposta.vigenciaFim),
          vencimentoPrimeira: new Date(dadosProposta.vencimentoPrimeira)
        },
        include: {
          cliente: true,
          seguradora: true,
          produto: true,
          ramo: true,
          parcelas: true
        }
      });

      // Criar parcelas automaticamente
      const parcelas = Array.from({ length: req.body.numeroParcelas }, (_, i) => ({
        propostaId: proposta.id,
        numero: i + 1,
        vencimento: this.calcularVencimento(req.body.vencimentoPrimeira, i),
        valor: this.calcularValorParcela(req.body.premioTotal, req.body.numeroParcelas, i),
        status: 'PENDENTE',
      }));

      await prisma.parcela.createMany({ data: parcelas });

      res.status(201).json(proposta);
    } catch (error) {
      console.error('Erro ao criar proposta:', error);
      res.status(500).json({ error: 'Erro ao criar proposta' });
    }
  }

  private calcularVencimento(primeiroVencimento: Date, parcela: number): Date {
    const data = new Date(primeiroVencimento);
    data.setMonth(data.getMonth() + parcela);
    return data;
  }

  private calcularValorParcela(total: number, numeroParcelas: number, parcela: number): number {
    const valorParcela = total / numeroParcelas;
    return Number(valorParcela.toFixed(2));
  }

  async atualizar(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const proposta = await prisma.proposta.update({
        where: { id: Number(id) },
        data: {
          ...req.body,
          alteradoPor: req.body.usuarioId || 'SISTEMA',
          updatedAt: new Date(),
        },
      });

      res.json(proposta);
    } catch (error) {
      console.error('Erro ao atualizar proposta:', error);
      res.status(500).json({ error: 'Erro ao atualizar proposta' });
    }
  }

  async buscarPorId(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const proposta = await prisma.proposta.findUnique({
        where: {
          id: id
        },
        include: {
          cliente: true,
          seguradora: true,
          produto: true,
          ramo: true,
          parcelas: true,
          comissoes: true
        }
      });

      if (!proposta) {
        return res.status(404).json({ error: 'Proposta não encontrada' });
      }

      res.json(proposta);
    } catch (error) {
      console.error('Erro ao buscar proposta:', error);
      res.status(500).json({ error: 'Erro ao buscar proposta' });
    }
  }

  async listar(req: Request, res: Response) {
    try {
      const filtros = req.query;
      let whereClause: any = {};
   
      if (filtros.cliente) {
        whereClause = {
          ...whereClause,
          cliente: { nome: { contains: String(filtros.cliente) } }
        };
      }
   
      if (filtros.numeroProposta) {
        whereClause = {
          ...whereClause,
          numero: { contains: String(filtros.numeroProposta) }
        };
      }
   
      if (filtros.documento) {
        whereClause = {
          ...whereClause,
          status: String(filtros.documento)
        };
      }
   
      if (filtros.numeroApolice) {
        whereClause = {
          ...whereClause,
          numeroApolice: { contains: String(filtros.numeroApolice) }
        };
      }
   
      if (filtros.seguradora) {
        whereClause = {
          ...whereClause,
          seguradoraId: Number(filtros.seguradora)
        };
      }
   
      if (filtros.produto) {
        whereClause = {
          ...whereClause,
          produtoId: Number(filtros.produto)
        };
      }
   
      if (filtros.ramo) {
        whereClause = {
          ...whereClause,
          ramoId: Number(filtros.ramo)
        };
      }
   
      const propostas = await prisma.proposta.findMany({
        where: whereClause,
        include: {
          cliente: true,
          seguradora: true,
          produto: true,
          ramo: true
        },
        orderBy: {
          dataProposta: 'desc'
        }
      });
   
      res.json(propostas);
    } catch (error) {
      console.error('Erro ao listar propostas:', error);
      res.status(500).json({ error: 'Erro ao listar propostas' });
    }
   }

  async excluir(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await prisma.proposta.delete({
        where: { id: Number(id) },
      });

      res.status(204).send();
    } catch (error) {
      console.error('Erro ao excluir proposta:', error);
      res.status(500).json({ error: 'Erro ao excluir proposta' });
    }
  }
}