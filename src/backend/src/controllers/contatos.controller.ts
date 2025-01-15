
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

export class ContatosController {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async criar(req: Request, res: Response) {
    const { clienteId } = req.params;
    const { tipo, nome, sexo, cargo, tratamento, email, dtNascimento, cpf, telefone, celular } = req.body;
  
    try {
      if (!clienteId) {
        return res.status(400).json({ message: 'clienteId é necessário' });
      }
  
      const contatos = await this.prisma.contato.create({
        data: {
          tipo,
          nome,
          sexo,
          cargo, 
          tratamento,
          email,
          dtNascimento,
          cpf,
          telefone: telefone.replace(/\D/g, ''),
          celular: celular.replace(/\D/g, ''),
          cliente: {
            connect: { id: parseInt(clienteId) }, 
          },
        },
      });
  
      res.status(201).json(contatos);
    } catch (error) {
      console.error('Erro detalhado ao criar contato:', error);
  
      if (error instanceof Error) {
        res.status(500).json({
          message: 'Erro ao criar contato',
          error: error.message,
          stack: error.stack,
        });
      } else {
        res.status(500).json({
          message: 'Erro desconhecido ao criar contato',
          errorObject: error,
        });
      }
    }
  }

  async listarPorCliente(req: Request, res: Response) {
    const { clienteId } = req.params;

    try {
      const contatos = await this.prisma.contato.findMany({
        where: {
          clienteId: parseInt(clienteId)
        }
      });

      res.json(contatos);
    } catch (error) {
      console.error('Erro ao listar contato:', error);
      res.status(500).json({
        message: 'Erro ao listar contato',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  async excluir(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await this.prisma.contato.delete({
        where: {
          id: parseInt(id)
        }
      });

      res.status(204).send();
    } catch (error) {
      console.error('Erro ao excluir contato:', error);
      res.status(500).json({
        message: 'Erro ao excluir contato',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }
}