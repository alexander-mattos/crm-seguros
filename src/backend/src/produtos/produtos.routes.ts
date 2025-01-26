import { Router } from 'express';
import { ProdutosController } from './produtos.controller';
import { ProdutosService } from './produtos.service';
import { validateProdutosMiddleware } from '../middlewares/validator';

const router = Router();
const produtosController = new ProdutosController();
const produtosService = new ProdutosService();

// Rotas de diagnóstico
router.get('/diagnostico/schema', async (req, res) => {
  try {
      const schema = await produtosService.checkDatabaseSchema();
      res.json({
          success: true,
          data: schema
      });
  } catch (error) {
      res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
  }
});

// Rota para criar novo produto
router.post('/incluir', validateProdutosMiddleware, (req, res) => {
    produtosController.createProduto(req, res);
});

// Rota para listar todos os produtos
router.get('/', (req, res) => {
    produtosController.getAllProdutos(req, res);
});

// Rota para buscar produtos por ID
router.get('/:id', (req, res) => {
    produtosController.findById(req, res);
});

// Rota para excluir produto
router.delete('/:id', (req, res) => {
    produtosController.delete(req, res);
});


export default router;