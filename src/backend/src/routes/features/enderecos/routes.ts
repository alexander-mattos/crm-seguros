import { Router, Request, Response, NextFunction } from 'express';
import { EnderecoController } from '../../../controllers/endereco.controller';
import { validateEnderecoMiddleware } from '../../../middlewares/validator';

const router = Router();
const enderecoController = new EnderecoController();

/**
 * @route   POST /api/clientes/:clienteId/endereco
 * @desc    Criar novo endereço
 * @access  Private
 */
router.post(
  '/:clienteId',
  validateEnderecoMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await enderecoController.criar(req, res);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   GET /api/clientes/:clienteId/enderecos
 * @desc    Listar endereços por cliente
 * @access  Private
 */
router.get(
  '/:clienteId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await enderecoController.listarPorCliente(req, res);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   DELETE /api/enderecos/:id
 * @desc    Excluir endereço
 * @access  Private
 */
router.delete(
  '/endereco/:clienteId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await enderecoController.excluir(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default router;