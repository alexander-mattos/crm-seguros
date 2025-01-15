
import { Router } from 'express';
import { ProdutoController } from '../../../controllers/produto.controller';

const router = Router();
const produtoController = new ProdutoController();

router.get('/ramo/:ramoId', (req, res, next) => 
  produtoController.findByRamo(req, res).catch(next)
);

export default router;