
import { Router } from 'express';
import { RamosController } from './ramos.controller';

const router = Router();
const ramoController = new RamosController();

router.get('/', (req, res, next) => 
  ramoController.findAll(req, res).catch(next)
);

export default router;