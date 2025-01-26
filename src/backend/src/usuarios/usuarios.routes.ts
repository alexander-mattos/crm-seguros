import { Router } from 'express';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { validateUsuariosMiddleware } from '../middlewares/validator';

const router = Router();
const usuarioController = new UsuariosController();
const usuarioService = new UsuariosService();

// Rotas de diagnóstico
router.get('/diagnostico/schema', async (req, res) => {
    try {
        const schema = await usuarioService.checkDatabaseSchema();
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

// Rota para criar novo usuário
router.post('/incluir', validateUsuariosMiddleware, (req, res) => {
    usuarioController.createUsuario(req, res);
});

// Rota para listar todos os usuários
router.get('/', (req, res) => {
    usuarioController.getAllUsuarios(req, res);
});

// Rota para buscar usuario por ID
router.get('/:id', (req, res) => {
    usuarioController.findById(req, res);
});

// Rota para excluir usuario
router.delete('/:id', (req, res) => {
    usuarioController.delete(req, res);
});

export default router;