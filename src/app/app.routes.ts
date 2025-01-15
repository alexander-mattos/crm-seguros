import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/components/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'configuracoes',
    loadComponent: () => import('./features/configuracoes/components/configuracoes.component').then(m => m.ConfiguracoesComponent)
  },
  {
    path: 'atividades',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/atividades/atividades.component').then(m => m.AtividadesComponent)
      },
      {
        path: 'incluir',
        loadComponent: () => import('./features/atividades/incluiratividades/incluiratividades.component').then(m => m.IncluirAtividadesComponent)
      }
    ]
  },
  {
    path: 'oportunidades',
    loadComponent: () => import('./features/oportunidades/oportunidades.component').then(m => m.OportunidadesComponent)
  },
  {
    path: 'apolices',
    loadComponent: () => import('./features/apolices/apolices.component').then(m => m.ApolicesComponent)
  },
  {
    path: 'arquivos',
    loadComponent: () => import('./features/arquivos/arquivos.component').then(m => m.ArquivosComponent)
  },
  {
    path: 'sinistros',
    loadComponent: () => import('./features/sinistros/sinistros.component').then(m => m.SinistrosComponent)
  },
  {
    path: 'clientes',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/clientes/components/clientes.component').then(m => m.ClientesComponent)
      },
      {
        path: 'incluir',
        loadComponent: () => import('./features/clientes/incluirclientes/incluirclientes.component').then(m => m.IncluirclientesComponent)
      },
      {
        path: 'dash/:id',
        loadComponent: () => import('./features/clientes/dashclientes/dashclientes.component').then(m => m.DashclientesComponent)
      },
      {
        path: 'editar/:id',
        loadComponent: () => import('./features/clientes/incluirclientes/incluirclientes.component').then(m => m.IncluirclientesComponent)
      },
      {
        path: 'endereco/:id',
        loadComponent: () => import('./features/clientes/enderecoclientes/enderecoclientes.component').then(m => m.EnderecoClientesComponent)
      },
      {
        path: 'telefones/:id',
        loadComponent: () => import('./features/clientes/telefoneclientes/telefoneclientes.component').then(m => m.TelefoneclientesComponent)
      },
      {
        path: 'contatos/:id',
        loadComponent: () => import('./features/clientes/contatosclientes/contatosclientes.component').then(m => m.ContatosClientesComponent)
      },
      {
        path: 'notas/:id',
        loadComponent: () => import('./features/clientes/dashclientes/dashclientes.component').then(m => m.DashclientesComponent)
      },
      {
        path: 'oportunidades',
        loadComponent: () => import('./features/clientes/oportunidadesclientes/oportunidadesclientes.component').then(m => m.OportunidadesclientesComponent)
      },
      {
        path: 'importador',
        loadComponent: () => import('./features/clientes/importador/components/importarclientes.component').then(m => m.ImportarclientesComponent)
      }
    ]
  },
  {
    path: 'financeiro',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/financeiro/components/financeiro.component').then(m => m.FinanceiroComponent)
      },
      {
        path: 'lancamentos',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/financeiro/lancamentos/components/lancamentos.component').then(m => m.LancamentosComponent)
          },
          {
            path: 'incluir',
            loadComponent: () => import('./features/financeiro/lancamentos/incluir/components/incluirlancamentos.component').then(m => m.IncluirlancamentosComponent)
          }
        ]
      },
      {
        path: 'cadastros',
        children: [
          {
            path: 'bancos',
            children: [
              {
                path: '',
                loadComponent: () => import('./features/financeiro/cadastros/bancos/components/bancos.component').then(m => m.BancosComponent)
              },
              {
                path: 'incluir',
                loadComponent: () => import('./features/financeiro/cadastros/bancos/incluir/incluirbancos.component').then(m => m.IncluirbancosComponent)
              }
            ]
          },
          {
            path: 'centrodecustos',
            children: [
              {
                path: '',
                loadComponent: () => import('./features/financeiro/cadastros/centrodecustos/centrodecustos.component').then(m => m.CentrodecustosComponent)
              },
              {
                path: 'inserir',
                loadComponent: () => import('./features/financeiro/cadastros/centrodecustos/inserir/inserircentrodecustos.component').then(m => m.InserircentrodecustosComponent)
              }
            ]
          },
          {
            path: 'planodecontas',
            children: [
              {
                path: '',
                loadComponent: () => import('./features/financeiro/cadastros/planodecontas/planodecontas.component').then(m => m.PlanodecontasComponent)
              },
              {
                path: 'incluir',
                loadComponent: () => import('./features/financeiro/cadastros/planodecontas/incluir/incluirplanodecontas.component').then(m => m.IncluirplanodecontasComponent)
              }
            ]
          },
          {
            path: 'fornecedores',
            children: [
              {
                path: '',
                loadComponent: () => import('./features/financeiro/cadastros/fornecedores/fornecedores.component').then(m => m.FornecedoresComponent)
              },
              {
                path: 'incluir',
                loadComponent: () => import('./features/financeiro/cadastros/fornecedores/incluir/incluirfornecedores.component').then(m => m.IncluirfornecedoresComponent)
              }
            ]
          }
        ]
      },
      {
        path: 'relatorios',
        loadComponent: () => import('./features/financeiro/relatorios/relatorios.component').then(m => m.RelatoriosComponent)
      }
    ]
  },
  {
    path: 'propostas',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/propostas/components/propostas.component').then(m => m.PropostasComponent)
      },
      {
        path: 'incluir',
        loadComponent: () => import('./features/propostas/incluirproposta/incluirproposta.component').then(m => m.IncluirPropostaComponent)
      }
    ]
  },
  {
    path: 'teste',
    loadComponent: () => import('./components/teste/teste.component').then(m => m.TesteComponent)
  }
];