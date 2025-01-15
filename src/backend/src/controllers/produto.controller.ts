
import { Request, Response } from 'express';
import { ProdutoService } from '../services/produtos/produto.service';
import { AppError } from '../middlewares/error';

export class ProdutoController {
  private produtoService: ProdutoService;

  constructor() {
    this.produtoService = new ProdutoService();
  }

  async findByRamo(req: Request, res: Response) {
    try {
      const ramoId = parseInt(req.params.ramoId);
      if (isNaN(ramoId)) {
        throw new AppError('ID do ramo inválido', 400);
      }
      
      const produtos = await this.produtoService.findByRamo(ramoId);
      res.json(produtos);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao listar produtos', 500);
    }
  }
}