
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

export class NotasController {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async criar(req: Request, res: Response) {
    const { clienteId } = req.params;
    const { content } = req.body;
  
    try {
      if (!clienteId) {
        return res.status(400).json({ message: 'clienteId é necessário' });
      }
  
      const nota = await this.prisma.nota.create({
        data: {
          content,
          cliente: {
            connect: { id: parseInt(clienteId) }, 
          },
        },
      });
  
      res.status(201).json(content);
    } catch (error) {
      console.error('Erro detalhado ao criar nota:', error);
  
      if (error instanceof Error) {
        res.status(500).json({
          message: 'Erro ao criar nota',
          error: error.message,
          stack: error.stack,
        });
      } else {
        res.status(500).json({
          message: 'Erro desconhecido ao criar nota',
          errorObject: error,
        });
      }
    }
  }

  async listarPorCliente(req: Request, res: Response) {
    const { clienteId } = req.params;

    try {
      const notas = await this.prisma.nota.findMany({
        where: {
          clienteId: parseInt(clienteId)
        }
      });

      res.json(notas);
    } catch (error) {
      console.error('Erro ao listar notas:', error);
      res.status(500).json({
        message: 'Erro ao listar notas',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  async excluir(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await this.prisma.nota.delete({
        where: {
          id: parseInt(id)
        }
      });

      res.status(204).send();
    } catch (error) {
      console.error('Erro ao excluir nota:', error);
      res.status(500).json({
        message: 'Erro ao excluir nota',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }
}