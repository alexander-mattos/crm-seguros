
import { Request, Response } from 'express';
import { RamosService } from './ramos.service';
import { AppError } from '../middlewares/error';

export class RamosController {
  private ramosService: RamosService;

  constructor() {
    this.ramosService = new RamosService();
  }

  async findAll(req: Request, res: Response) {
    try {
      const ramos = await this.ramosService.findAllRamos();
      res.json(ramos);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao listar ramos', 500);
    }
  }
}