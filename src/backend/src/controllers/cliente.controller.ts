import { Request, Response } from 'express';
import { ClienteService } from '../services/clientes/cliente.service';
import { AppError } from '../middlewares/error';
import { ZodError } from 'zod';

export class ClienteController {
  private clienteService: ClienteService;

  constructor() {
    this.clienteService = new ClienteService();
  }

  async create(req: Request, res: Response) {
    try {
      const cliente = await this.clienteService.create(req.body);
      res.status(201).json({
        status: 'success',
        data: cliente
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        error instanceof Error ? error.message : 'Erro ao criar cliente',
        400
      );
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const queryParams = req.query;
      const clientes = await this.clienteService.findAll({
        nome: queryParams.nome as string,
        nomeSocial: queryParams.nomeSocial as string,
        tipoPessoa: queryParams.tipoPessoa as string,
        status: queryParams.status as string,
        unidadeNegocio: queryParams.unidadeNegocio as string,
        limite: queryParams.limite ? Number(queryParams.limite) : undefined
      });

      res.json(clientes);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        throw new AppError('ID inválido', 400);
      }

      const cliente = await this.clienteService.findById(id);
      if (!cliente) {
        throw new AppError('Cliente não encontrado', 404);
      }

      res.json({
        status: 'success',
        data: cliente
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Erro ao buscar cliente', 500);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        throw new AppError('ID inválido', 400);
      }

      const clienteExiste = await this.clienteService.findById(id);
      
      if (!clienteExiste) {
        throw new AppError('Cliente não encontrado', 404);
      }

      const cliente = await this.clienteService.update(id, req.body);
      res.json({
        status: 'success',
        data: cliente
      });
    } catch (error) {
      if (error instanceof ZodError) {
        throw new AppError('Dados inválidos: ' + error.errors.map(e => e.message).join(', '), 400);
      }
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        error instanceof Error ? error.message : 'Erro ao atualizar cliente',
        400
      );
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        throw new AppError('ID inválido', 400);
      }

      const clienteExiste = await this.clienteService.findById(id);
      if (!clienteExiste) {
        throw new AppError('Cliente não encontrado', 404);
      }

      await this.clienteService.delete(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Erro ao excluir cliente', 500);
    }
  }
}