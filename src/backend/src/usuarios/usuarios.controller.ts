import { Request, Response } from 'express';
import { UsuariosService } from './usuarios.service';
import { AppError } from '../middlewares/error';

export class UsuariosController {
    private usuarioService: UsuariosService;

    constructor() {
        this.usuarioService = new UsuariosService();
    }

    async getAllUsuarios(req: Request, res: Response) {
        try {
            const usuarios = await this.usuarioService.findAllUsuarios();
            res.json({
                success: true,
                data: usuarios
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

            console.log('Buscando usuario com ID:', numId);
            const usuario = await this.usuarioService.findById(numId);

            res.json({
                success: true,
                data: usuario
            });
        } catch (error) {
            console.error('Erro ao buscar usuario:', error);
            if (error instanceof AppError) {
                res.status(error.statusCode).json({
                    success: false,
                    error: error.message
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: 'Erro ao buscar usuario'
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

            console.log('Excluindo usuario com ID:', numId);
            await this.usuarioService.delete(numId);

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

    async createUsuario(req: Request, res: Response) {
        try {
            const usuario = await this.usuarioService.createUsuario(req.body);
            res.status(201).json({
                success: true,
                data: usuario
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