import { Request, Response } from 'express';
import { ProdutosService } from './produtos.service';
import { AppError } from '../middlewares/error';

export class ProdutosController {
  private produtosService: ProdutosService;

  constructor() {
    this.produtosService = new ProdutosService();
  }

  async getAllProdutos(req: Request, res: Response) {
    try {
        const seguros = await this.produtosService.findAllProdutos();
        res.json({
            success: true,
            data: seguros
        });
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                success: false,
                error: error.message
            });
        } else {
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }
}

async findById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        
        if (!id) {
            throw new AppError('ID não fornecido', 400);
        }

        const numId = parseInt(id);
        if (isNaN(numId)) {
            throw new AppError('ID inválido', 400);
        }

        console.log('Buscando produto com ID:', numId);
        const seguros = await this.produtosService.findById(numId);

        res.json({
            success: true,
            data: seguros
        });
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                success: false,
                error: error.message
            });
        } else {
            res.status(500).json({
                success: false,
                error: 'Erro ao buscar produto'
            });
        }
    }
}

async delete(req: Request, res: Response) {
    try {
        const { id } = req.params;

        if (!id) {
            throw new AppError('ID não fornecido', 400);
        }

        const numId = parseInt(id);
        if (isNaN(numId)) {
            throw new AppError('ID inválido', 400);
        }

        console.log('Excluindo produto com ID:', numId);
        await this.produtosService.delete(numId);

        res.status(200).json({
            success: true,
            message: 'Usuário excluído com sucesso'
        });
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                success: false,
                error: error.message
            });
        } else {
            res.status(500).json({
                success: false,
                error: 'Erro ao excluir usuário'
            });
        }
    }
}

async createProduto(req: Request, res: Response) {
    try {
        const seguros = await this.produtosService.createProduto(req.body);
        res.status(201).json({
            success: true,
            data: seguros
        });
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                success: false,
                error: error.message
            });
        } else {
            res.status(500).json({
                success: false,
                error: 'Erro ao criar usuário'
            });
        }
    }
}
}