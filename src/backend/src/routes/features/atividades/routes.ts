
import { Router } from 'express';
import { AtividadeController } from '../../../controllers/atividades.controller';

const router = Router();

router.post('/', AtividadeController.criar);
router.get('/cliente/:clienteId', AtividadeController.listarPorCliente);
// Adicionar outras rotas conforme necessário

export default router;