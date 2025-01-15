
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

export class TelefoneController {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async criar(req: Request, res: Response) {
    const { clienteId } = req.params;
    const { tipo, numero, ramal, contato } = req.body;
  
    try {
      if (!clienteId) {
        return res.status(400).json({ message: 'clienteId é necessário' });
      }
  
      const telefone = await this.prisma.telefone.create({
        data: {
          tipo,
          numero: numero.replace(/\D/g, ''), 
          ramal,
          contato,
          cliente: {
            connect: { id: parseInt(clienteId) }, 
          },
        },
      });
  
      res.status(201).json(telefone);
    } catch (error) {
      console.error('Erro detalhado ao criar telefone:', error);
  
      if (error instanceof Error) {
        res.status(500).json({
          message: 'Erro ao criar telefone',
          error: error.message,
          stack: error.stack,
        });
      } else {
        res.status(500).json({
          message: 'Erro desconhecido ao criar telefone',
          errorObject: error,
        });
      }
    }
  }

  async listarPorCliente(req: Request, res: Response) {
    const { clienteId } = req.params;

    try {
      const telefones = await this.prisma.telefone.findMany({
        where: {
          clienteId: parseInt(clienteId)
        }
      });

      res.json(telefones);
    } catch (error) {
      console.error('Erro ao listar telefones:', error);
      res.status(500).json({
        message: 'Erro ao listar telefones',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  async excluir(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await this.prisma.telefone.delete({
        where: {
          id: parseInt(id)
        }
      });

      res.status(204).send();
    } catch (error) {
      console.error('Erro ao excluir telefone:', error);
      res.status(500).json({
        message: 'Erro ao excluir telefone',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }
}