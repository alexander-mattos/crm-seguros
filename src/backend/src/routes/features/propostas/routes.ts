import { Router, Request, Response, NextFunction } from 'express';
import { PropostaController } from '../../../controllers/proposta.controller';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const router = Router();
const propostaController = new PropostaController();

/**
 * @route   POST /api/clientes/incluir
 * @desc    Criar novo cliente
 * @access  Private
 */
router.post(
  '/incluir',
  async (req: Request, res: Response, next: NextFunction) => {
    await propostaController.criar(req, res).catch(next);
  }
);

/**
 * @route   GET /api/propostas
 * @desc    Listar todas as propostas
 * @access  Private
 */
router.get(
  '/',
  (req, res, next) => propostaController.listar(req, res).catch(next)
);

/**
 * @route   GET /api/propostas/:id
 * @desc    Buscar proposta por ID
 * @access  Private
 */

router.get(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    await propostaController.buscarPorId(req, res).catch(next);
  }
);

router.put(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    await propostaController.atualizar(req, res);
  }
);

router.delete(
  '/:id',
  (req, res, next) => propostaController.excluir(req, res).catch(next)
);

export default router;