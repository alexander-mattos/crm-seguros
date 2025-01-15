import { Router, Request, Response, NextFunction } from 'express';
import { NotasController } from '../../../controllers/notas.controller';
import { validateNotasMiddleware } from '../../../middlewares/validator';

const router = Router();
const notaController = new NotasController();

/**
 * @route   POST /api/clientes/notas/:clienteId
 * @desc    Criar nova nota
 * @access  Private
 */
router.post(
  '/:clienteId',
  validateNotasMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await notaController.criar(req, res);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   GET /api/clientes/notas/:clienteId
 * @desc    Listar notas por cliente
 * @access  Private
 */
router.get(
  '/:clienteId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await notaController.listarPorCliente(req, res);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   DELETE /api/notas/:id
 * @desc    Excluir nota
 * @access  Private
 */
router.delete(
  '/notas/:clienteId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await notaController.excluir(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default router;