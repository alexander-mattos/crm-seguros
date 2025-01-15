
import { Router } from 'express';
import { SeguradoraController } from '../../../controllers/seguradora.controller';

const router = Router();
const seguradoraController = new SeguradoraController();

router.get('/', (req, res, next) => 
  seguradoraController.findAll(req, res).catch(next)
);

export default router;