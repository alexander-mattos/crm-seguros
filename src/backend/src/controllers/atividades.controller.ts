
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const AtividadeController = {
  async criar(req: Request, res: Response) {
    try {
      console.log('Dados recebidos:', req.body); // Log para debug
      const atividade = await prisma.atividade.create({
        data: {
          ...req.body,
          //  criadoPor: req.user?.nome || 'Sistema' 
        }
      });
      res.json(atividade);
    } catch (error) {
      console.error('Erro ao criar atividade:', error); // Log detalhado do erro
      res.status(500).json({ error: 'Erro ao criar atividade' });
    }
  },

  async listarPorClienteId(req: Request, res: Response) {
    const { clienteId } = req.params;
    try {
      const atividadeWithIdOnly = await prisma.atividade.findMany({ select: { id: true } })

      res.json(atividadeWithIdOnly);
    } catch (error) {
      console.error('Erro ao listar atividades:', error);
      res.status(500).json({ error: 'Erro ao listar atividades' });
    }
  },

  async listarPorCliente(req: Request, res: Response) {
    const { clienteId } = req.params;
    try {
      const atividades = await prisma.atividade.findMany({
        where: {
          clienteId: parseInt(clienteId)
        },
        include: {
          // Incluindo os dados do relacionamento com o cliente
          cliente: {
            select: {
              nome: true  // Selecionando apenas o campo nome do cliente
            }
          }
        },
        orderBy: {
          data: 'desc'
        }
      });

      // Formatando a resposta para incluir o nome do cliente
      const atividadesFormatadas = atividades.map(atividade => ({
        ...atividade,
        clienteNome: atividade.cliente.nome
      }));

      res.json(atividadesFormatadas);
    } catch (error) {
      console.error('Erro ao listar atividades:', error);
      res.status(500).json({ error: 'Erro ao listar atividades' });
    }
  }
} 