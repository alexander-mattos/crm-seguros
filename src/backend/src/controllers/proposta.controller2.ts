
import { Request, Response } from 'express';
import { PropostaService } from '../services/proposta.service';
import { AppError } from '../middlewares/error';

export class PropostaController {
  private propostaService: PropostaService;

  constructor() {
    this.propostaService = new PropostaService();
  }

  async create(req: Request, res: Response) {
    try {
      // Gerar número da proposta (podemos criar uma função específica para isso)
      const numeroProposta = `PROP${new Date().getFullYear()}${Math.floor(Math.random() * 100000)}`;
      
      const propostaData = {
        ...req.body,
        numero: numeroProposta,
        dataProposta: new Date(),
        criadoPor: req.body.criadoPor || 'SISTEMA' // Idealmente virá do usuário logado
      };

      const proposta = await this.propostaService.create(propostaData);
      res.status(201).json({
        status: 'success',
        data: proposta
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        error instanceof Error ? error.message : 'Erro ao criar proposta',
        400
      );
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const propostas = await this.propostaService.findAll();
      res.json({
        status: 'success',
        data: propostas
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Erro ao listar propostas', 500);
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        throw new AppError('ID inválido', 400);
      }

      const proposta = await this.propostaService.findById(id);
      res.json({
        status: 'success',
        data: proposta
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Erro ao buscar proposta', 500);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        throw new AppError('ID inválido', 400);
      }

      const proposta = await this.propostaService.update(id, {
        ...req.body,
        alteradoPor: req.body.alteradoPor || 'SISTEMA' // Idealmente virá do usuário logado
      });

      res.json({
        status: 'success',
        data: proposta
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Erro ao atualizar proposta', 400);
    }
  }

  async converter(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        throw new AppError('ID inválido', 400);
      }

      const apolice = await this.propostaService.converterEmApolice(id);
      res.json({
        status: 'success',
        data: apolice
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Erro ao converter proposta em apólice', 400);
    }
  }
}