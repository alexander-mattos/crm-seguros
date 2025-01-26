import { Router } from 'express';
import { UnidadeNegocioController } from './unidadenegocio.controller';
import { UnidadeNegocioService } from './unidadenegocios.service';
import { validateUnidadeNegocioMiddleware } from '../middlewares/validator';

const router = Router();
const unidadeNegocioController = new UnidadeNegocioController();
const unidadeNegocioService = new UnidadeNegocioService();

// Rotas de diagnóstico
router.get('/diagnostico/schema', async (req, res) => {
    try {
        const schema = await unidadeNegocioService.checkDatabaseSchema();
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

// Rota para criar nova Unidade de negócio
router.post('/incluir', validateUnidadeNegocioMiddleware, (req, res) => {
    unidadeNegocioController.createUnidadeNegocio(req, res);
});

// Rota para listar todos as unidades de negócio
router.get('/', (req, res) => {
    unidadeNegocioController.getAllUnidadeNegocio(req, res);
});

// Rota para buscar unidades por ID
router.get('/:id', (req, res) => {
    unidadeNegocioController.findById(req, res);
});

// Rota para excluir unidade
router.delete('/:id', (req, res) => {
    unidadeNegocioController.delete(req, res);
});

export default router;