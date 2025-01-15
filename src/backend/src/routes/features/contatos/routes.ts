import { Router, Request, Response, NextFunction } from 'express';
import { ContatosController } from '../../../controllers/contatos.controller';
import { validateContatosMiddleware } from '../../../middlewares/validator';

const router = Router();
const contatoController = new ContatosController();

/**
 * @route   POST /api/clientes/contatos/:clienteId
 * @desc    Criar novo contato
 * @access  Private
 */
router.post(
  '/:clienteId',
  validateContatosMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await contatoController.criar(req, res);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   GET /api/clientes/contatos/:clienteId
 * @desc    Listar contatos por cliente
 * @access  Private
 */
router.get(
  '/:clienteId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await contatoController.listarPorCliente(req, res);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   DELETE /api/contatos/:id
 * @desc    Excluir contato
 * @access  Private
 */
router.delete(
  '/contatos/:clienteId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await contatoController.excluir(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default router;