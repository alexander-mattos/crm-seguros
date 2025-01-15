import { Router, Request, Response, NextFunction } from 'express';
import { TelefoneController } from '../../../controllers/telefone.controller';
import { validateTelefoneMiddleware } from '../../../middlewares/validator';

const router = Router();
const telefoneController = new TelefoneController();

/**
 * @route   POST /api/telefones
 * @desc    Criar novo telefone
 * @access  Private
 */
router.post(
  '/:clienteId',
  validateTelefoneMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await telefoneController.criar(req, res);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   GET /api/telefones/cliente/:clienteId
 * @desc    Listar telefones por cliente
 * @access  Private
 */
router.get(
  '/:clienteId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await telefoneController.listarPorCliente(req, res);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   DELETE /api/telefones/:id
 * @desc    Excluir telefone
 * @access  Private
 */
router.delete(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await telefoneController.excluir(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default router;