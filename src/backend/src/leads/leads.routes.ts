import { Router } from 'express';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { validateLeadsMiddleware } from '../middlewares/validator';

const router = Router();
const leadController = new LeadsController();
const leadService = new LeadsService();

// Rotas de diagnóstico
router.get('/diagnostico/schema', async (req, res) => {
    try {
        const schema = await leadService.checkDatabaseSchema();
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

// Rota para criar novo lead
router.post('/incluir', validateLeadsMiddleware, (req, res) => {
    leadController.createLead(req, res);
});

// Rota para listar todos os leads
router.get('/', (req, res) => {
    leadController.getAllLeads(req, res);
});

// Rota para buscar lead por ID
router.get('/:id', (req, res) => {
    leadController.findById(req, res);
});

// Rota para excluir lead
router.delete('/:id', (req, res) => {
    leadController.delete(req, res);
});

export default router;