
import { Request, Response } from 'express';
import { SeguradoraService } from '../services/seguradoras/seguradora.service';
import { AppError } from '../middlewares/error';

export class SeguradoraController {
  private seguradoraService: SeguradoraService;

  constructor() {
    this.seguradoraService = new SeguradoraService();
  }

  async findAll(req: Request, res: Response) {
    try {
      const seguradoras = await this.seguradoraService.findAll();
      res.json(seguradoras);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao listar seguradoras', 500);
    }
  }
}
