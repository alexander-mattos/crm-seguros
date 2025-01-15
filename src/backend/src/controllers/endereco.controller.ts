
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

export class EnderecoController {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async criar(req: Request, res: Response) {
    const { clienteId } = req.params;
    const { tipo, cep, endereco, numero, complemento, bairro, cidade, estado, correspondencia, aoscuidados } = req.body;
  
    try {
      if (!clienteId) {
        return res.status(400).json({ message: 'clienteId é necessário' });
      }
  
      const enderecos = await this.prisma.endereco.create({
        data: {
          tipo,
          cep,
          endereco,
          numero: numero.replace(/\D/g, ''), 
          complemento,
          bairro,
          cidade,
          estado,
          correspondencia,
          aoscuidados,
          cliente: {
            connect: { id: parseInt(clienteId) }, 
          },
        },
      });
  
      res.status(201).json(enderecos);
    } catch (error) {
      console.error('Erro detalhado ao criar endereco:', error);
  
      if (error instanceof Error) {
        res.status(500).json({
          message: 'Erro ao criar Endereço',
          error: error.message,
          stack: error.stack,
        });
      } else {
        res.status(500).json({
          message: 'Erro desconhecido ao criar Endereço',
          errorObject: error,
        });
      }
    }
  }

  async listarPorCliente(req: Request, res: Response) {
    const { clienteId } = req.params;

    try {
      const enderecos = await this.prisma.endereco.findMany({
        where: {
          clienteId: parseInt(clienteId)
        }
      });

      res.json(enderecos);
    } catch (error) {
      console.error('Erro ao listar endereço:', error);
      res.status(500).json({
        message: 'Erro ao listar endereço',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  async excluir(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await this.prisma.endereco.delete({
        where: {
          id: parseInt(id)
        }
      });

      res.status(204).send();
    } catch (error) {
      console.error('Erro ao excluir endereco:', error);
      res.status(500).json({
        message: 'Erro ao excluir endereco',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }
}