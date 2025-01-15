
import { Request, Response } from 'express';
import { RamoService } from '../services/ramos/ramo.service';
import { AppError } from '../middlewares/error';

export class RamoController {
  private ramoService: RamoService;

  constructor() {
    this.ramoService = new RamoService();
  }

  async findAll(req: Request, res: Response) {
    try {
      const ramos = await this.ramoService.findAll();
      res.json(ramos);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao listar ramos', 500);
    }
  }
}