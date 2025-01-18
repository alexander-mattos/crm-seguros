import { Router } from 'express';
import clienteRoutes from './features/clientes/routes';
import seguradoraRoutes from './features/seguradoras/routes';
import ramoRoutes from './features/ramos/routes';
import produtoRoutes from './features/produtos/routes';
import propostaRoutes from './features/propostas/routes';
import atividadesRoutes from './features/atividades/routes';
import telefonesRoutes from './features/telefones/routes';
import enderecoRoutes from './features/enderecos/routes';
import contatoRoutes from './features/contatos/routes'
import notaRoutes from './features/notas/routes';
import leadsRoutes from '../leads/leads.routes';

const router = Router();

router.use('/clientes', clienteRoutes);
router.use('/seguradoras', seguradoraRoutes);
router.use('/ramos', ramoRoutes);
router.use('/produtos', produtoRoutes);
router.use('/propostas', propostaRoutes);
router.use('/atividades', atividadesRoutes);
router.use('/clientes/telefones', telefonesRoutes);
router.use('/clientes/endereco', enderecoRoutes);
router.use('/clientes/contatos', contatoRoutes);
router.use('/clientes/notas', notaRoutes);
router.use('/leads', leadsRoutes);

router.get('/health', (req, res) => {
    res.json({ 
      status: 'success',
      message: 'API running',
      timestamp: new Date()
    });
  });

export default router;