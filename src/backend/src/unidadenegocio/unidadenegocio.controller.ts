import { Request, Response } from 'express';
import { UnidadeNegocioService } from './unidadenegocios.service';
import { AppError } from '../middlewares/error';

export class UnidadeNegocioController {
    private unidadeNegocioService: UnidadeNegocioService;

    constructor() {
        this.unidadeNegocioService = new UnidadeNegocioService();
    }

    async getAllUnidadeNegocio(req: Request, res: Response) {
        try {
            const unidadeNegocio = await this.unidadeNegocioService.findAllUnidadeNegocio();
            res.json({
                success: true,
                data: unidadeNegocio
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

            console.log('Buscando unidade com ID:', numId);
            const unidadeNegocio = await this.unidadeNegocioService.findById(numId);

            res.json({
                success: true,
                data: unidadeNegocio
            });
        } catch (error) {
            console.error('Erro ao buscar unidade:', error);
            if (error instanceof AppError) {
                res.status(error.statusCode).json({
                    success: false,
                    error: error.message
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: 'Erro ao buscar unidade'
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

            console.log('Excluindo unidade com ID:', numId);
            await this.unidadeNegocioService.delete(numId);

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

    async createUnidadeNegocio(req: Request, res: Response) {
        try {
            const unidadeNegocio = await this.unidadeNegocioService.createUnidadeNegocio(req.body);
            res.status(201).json({
                success: true,
                data: unidadeNegocio
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