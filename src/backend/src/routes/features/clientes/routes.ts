
import { Router } from 'express';
import { ClienteController } from '../../../controllers/cliente.controller';
import { ImportacaoController } from '../../../controllers/importacao.controller';
import { validateClienteMiddleware } from '../../../middlewares/validator';
import { createRouteHandler } from '../../../utils/route.helper';

const router = Router();
const clienteController = new ClienteController();
const importacaoController = new ImportacaoController();

/**
 * @route   POST /api/clientes/incluir
 * @desc    Criar novo cliente
 * @access  Private
 */
router.post(
  '/incluir',
  validateClienteMiddleware,
  (req, res, next) => clienteController.create(req, res).catch(next)
);

/**
 * @route   GET /api/clientes
 * @desc    Listar todos os clientes
 * @access  Private
 */
router.get(
  '/',
  (req, res, next) => clienteController.findAll(req, res).catch(next)
);

/**
 * @route   GET /api/clientes/:id
 * @desc    Buscar cliente por ID
 * @access  Private
 */
router.get(
  '/:id',
  (req, res, next) => clienteController.findById(req, res).catch(next)
);

/**
 * @route   PUT /api/clientes/:id
 * @desc    Atualizar cliente
 * @access  Private
 */
router.put(
  '/:id',
  validateClienteMiddleware,
  (req, res, next) => clienteController.update(req, res).catch(next)
);

/**
 * @route   DELETE /api/clientes/:id
 * @desc    Excluir cliente
 * @access  Private
 */
router.delete(
  '/:id',
  (req, res, next) => clienteController.delete(req, res).catch(next)
);

/**
 * @route   POST /api/clientes/importar
 * @desc    Importar clientes
 * @access  Private
 */
router.post(
  '/importar', 
  createRouteHandler(async (req, res) => {
  await importacaoController.importarClientes(req, res);
}));

export default router;