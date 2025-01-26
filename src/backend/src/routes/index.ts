import { Router } from 'express';
import clienteRoutes from './features/clientes/routes';
import produtosRoutes from '../produtos/produtos.routes'
import propostaRoutes from './features/propostas/routes';
import atividadesRoutes from './features/atividades/routes';
import telefonesRoutes from './features/telefones/routes';
import enderecoRoutes from './features/enderecos/routes';
import contatoRoutes from './features/contatos/routes'
import notaRoutes from './features/notas/routes';
import leadsRoutes from '../leads/leads.routes';
import usuariosRoutes from '../usuarios/usuarios.routes';
import unidadeNegocioRoutes from '../unidadenegocio/unidadenegocio.routes'
import seguradorasRoutes from '../seguradoras/seguradoras.routes'
import ramosRoutes from '../ramos/ramos.routes'

const router = Router();

router.use('/clientes', clienteRoutes);
router.use('/configuracoes/produtos', produtosRoutes);
router.use('/propostas', propostaRoutes);
router.use('/atividades', atividadesRoutes);
router.use('/clientes/telefones', telefonesRoutes);
router.use('/clientes/endereco', enderecoRoutes);
router.use('/clientes/contatos', contatoRoutes);
router.use('/clientes/notas', notaRoutes);
router.use('/leads', leadsRoutes);
router.use('/configuracoes/usuarios', usuariosRoutes);
router.use('/configuracoes/unidadenegocio', unidadeNegocioRoutes);
router.use('/configuracoes/seguradoras', seguradorasRoutes);
router.use('/configuracoes/ramos', ramosRoutes);
router.use('/configuracoes/produtos', produtosRoutes);

router.get('/health', (req, res) => {
    res.json({ 
      status: 'success',
      message: 'API running',
      timestamp: new Date()
    });
  });

export default router;