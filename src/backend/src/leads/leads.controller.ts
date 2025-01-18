import { Request, Response } from 'express';
import { LeadsService } from './leads.service';
import { AppError } from '../middlewares/error';

export class LeadsController {
    private leadService: LeadsService;

    constructor() {
        this.leadService = new LeadsService();
    }

    async getAllLeads(req: Request, res: Response) {
        try {
            const leads = await this.leadService.findAllLeads();
            res.json({
                success: true,
                data: leads
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

            console.log('Buscando lead com ID:', numId);
            const lead = await this.leadService.findById(numId);

            res.json({
                success: true,
                data: lead
            });
        } catch (error) {
            console.error('Erro ao buscar lead:', error);
            if (error instanceof AppError) {
                res.status(error.statusCode).json({
                    success: false,
                    error: error.message
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: 'Erro ao buscar lead'
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

            console.log('Excluindo lead com ID:', numId);
            await this.leadService.delete(numId);

            res.status(200).json({
                success: true,
                message: 'Lead excluído com sucesso'
            });
        } catch (error) {
            console.error('Erro ao excluir lead:', error);
            if (error instanceof AppError) {
                res.status(error.statusCode).json({
                    success: false,
                    error: error.message
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: 'Erro ao excluir lead'
                });
            }
        }
    }

    async createLead(req: Request, res: Response) {
        try {
            const lead = await this.leadService.createLead(req.body);
            res.status(201).json({
                success: true,
                data: lead
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
                    error: 'Erro ao criar lead'
                });
            }
        }
    }
}