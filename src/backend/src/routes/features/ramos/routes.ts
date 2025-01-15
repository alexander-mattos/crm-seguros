
import { Router } from 'express';
import { RamoController } from '../../../controllers/ramo.controller';

const router = Router();
const ramoController = new RamoController();

router.get('/', (req, res, next) => 
  ramoController.findAll(req, res).catch(next)
);

export default router;