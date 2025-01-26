import { Router } from 'express';
import { SeguradorasController } from './seguradoras.controller';
import { SeguradorasService } from './seguradoras.service';
import { validateSeguradorasMiddleware } from '../middlewares/validator';

const router = Router();
const seguradorasController = new SeguradorasController();
const seguradorasService = new SeguradorasService();

// Rotas de diagnóstico
router.get('/diagnostico/schema', async (req, res) => {
    try {
        const schema = await seguradorasService.checkDatabaseSchema();
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

// Rota para criar nova Seguradora
router.post('/incluir', validateSeguradorasMiddleware, (req, res) => {
    seguradorasController.createSeguradora(req, res);
});

// Rota para listar todos as seguradoras
router.get('/', (req, res) => {
    seguradorasController.getAllSeguradoras(req, res);
});

// Rota para buscar seguradoras por ID
router.get('/:id', (req, res) => {
    seguradorasController.findById(req, res);
});

// Rota para excluir seguradora
router.delete('/:id', (req, res) => {
    seguradorasController.delete(req, res);
});

export default router;