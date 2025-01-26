import { Request, Response } from 'express';
import { SeguradorasService } from './seguradoras.service';
import { AppError } from '../middlewares/error';

export class SeguradorasController {
    private seguradorasService: SeguradorasService;

    constructor() {
        this.seguradorasService = new SeguradorasService();
    }

    async getAllSeguradoras(req: Request, res: Response) {
        try {
            const seguros = await this.seguradorasService.findAllSeguradoras();
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

            console.log('Buscando seguradora com ID:', numId);
            const seguros = await this.seguradorasService.findById(numId);

            res.json({
                success: true,
                data: seguros
            });
        } catch (error) {
            console.error('Erro ao buscar seguradora:', error);
            if (error instanceof AppError) {
                res.status(error.statusCode).json({
                    success: false,
                    error: error.message
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: 'Erro ao buscar seguradora'
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

            console.log('Excluindo seguradora com ID:', numId);
            await this.seguradorasService.delete(numId);

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

    async createSeguradora(req: Request, res: Response) {
        try {
            const seguros = await this.seguradorasService.createSeguradoras(req.body);
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