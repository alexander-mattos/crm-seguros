import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed de Seguradoras, Ramos e Produtos...');
  await prisma.produto.deleteMany({});
  await prisma.ramo.deleteMany({});
  await prisma.seguradora.deleteMany({});

  const seguradoras = [
    {
      nome: 'PORTO SEGURO CIA. DE SEGUROS GERAIS',
      susep: '05886',
      ddd: '11',
      telefone: '3366-3666',
      observacao: 'Uma das maiores seguradoras do Brasil'
    },
    {
      nome: 'BRADESCO AUTO/RE CIA DE SEGUROS',
      susep: '05444',
      ddd: '11',
      telefone: '4004-2757',
      observacao: 'Seguradora do grupo Bradesco'
    },
    {
      nome: 'BRADESCO SAÚDE S/A',
      susep: '00584',
      ddd: '11',
      telefone: '4004-2757',
      observacao: 'Seguradora do grupo Bradesco'
    },
    {
      nome: 'SULAMÉRICA SEGUROS DE PESSOAS E PREVIDENCIA',
      susep: '06785',
      ddd: '11',
      telefone: '3779-7000',
      observacao: 'Especializada em seguros de saúde'
    },
    {
      nome: 'LIBERTY SEGUROS S/A',
      susep: '05983',
      ddd: '11',
      telefone: '3556-9999',
      observacao: 'Forte presença em seguros automotivos'
    },
    {
      nome: 'HDI SEGUROS S/A',
      susep: '05177',
      ddd: '11',
      telefone: '3348-4000',
      observacao: 'Parte do grupo Talanx'
    },
    {
      nome: 'TOKIO MARINE SEGURADORA S/A',
      susep: '06190',
      ddd: '11',
      telefone: '3054-7000',
      observacao: 'Seguradora japonesa com forte presença no Brasil'
    },
    {
      nome: 'ALLIANZ SEGUROS',
      susep: '05177',
      ddd: '11',
      telefone: '3171-3000',
      observacao: 'Grupo alemão de serviços financeiros'
    },
    {
      nome: 'MAPFRE VERA CRUZ SEGURADORA S/A',
      susep: '06238',
      ddd: '11',
      telefone: '2663-3000',
      observacao: 'Grupo espanhol com forte presença na América Latina'
    },
    {
      nome: 'ZURICH - CIA. DE SEGUROS MINAS BRASIL',
      susep: '05495',
      ddd: '11',
      telefone: '4004-4000',
      observacao: 'Seguradora suíça com operações globais'
    },
    {
      nome: 'SOMPO SEGUROS S/A',
      susep: '05720',
      ddd: '11',
      telefone: '3156-1000',
      observacao: 'Antiga Marítima Seguros, adquirida pelo grupo japonês Sompo'
    },
    {
      nome: 'AIG SEGUROS BRASIL S/A',
      susep: '01414',
      ddd: '11',
      telefone: '3512-2000',
      observacao: 'Seguradora americana com forte presença global'
    },
    {
      nome: 'AMIL ASSISTÊNCIA MÉDICA INTERNACIONAL S/A',
      susep: '00584',
      ddd: '11',
      telefone: '4004-2757',
      observacao: null,
    },
    {
      nome: 'AZUL CIA. DE SEGUROS GERAIS',
      susep: '05886',
      ddd: '11',
      telefone: '3366-3666',
      observacao: 'Seguradora do grupo Porto Seguro'
    },
    {
      nome: 'ICATU HARTFORD SEGUROS S/A',
      susep: null,
      ddd: '11',
      telefone: null,
      observacao: null,
    },
    {
      nome: 'INTERMÉDICA SISTEMA DE SAÚDE S/A',
      susep: null,
      ddd: '11',
      telefone: null,
      observacao: 'Seguradora de saúde do grupo NotreDame Intermédica'
    },
    {
      nome: 'ITAÚ SEGUROS S/A',
      susep: null,
      ddd: '11',
      telefone: null,
      observacao: 'Seguradora do grupo Itaú Unibanco'
    },
    {
      nome: 'PREVENT SENIOR PRIVATE OPERADORA DE SAÚDE LTDA',
      susep: null,
      ddd: null,
      telefone: null,
      observacao: 'Seguradora de saúde especializada em idosos'
    }
  ];

  const ramos = [
    {
      codigo: '0531',
      nome: 'Automóvel',
      descricao: 'Seguros relacionados a veículos automotores',
      produtos: [
        { nome: 'Seguro Auto', codigo: '0531-1', descricao: 'Cobertura básica para automóveis', seguradoraNome: 'PORTO SEGURO CIA. DE SEGUROS GERAIS' },
        { nome: 'RCF-V', codigo: '0531-2', descricao: 'Responsabilidade Civil Facultativa de Veículos', seguradoraNome: 'PORTO SEGURO CIA. DE SEGUROS GERAIS' },
        { nome: 'APP', codigo: '0531-3', descricao: 'Acidentes Pessoais de Passageiros', seguradoraNome: 'PORTO SEGURO CIA. DE SEGUROS GERAIS' }
      ]
    },
    {
      codigo: '0929',
      nome: 'Vida',
      descricao: 'Seguros de vida e acidentes pessoais',
      produtos: [
        { nome: 'Vida Individual', codigo: '0929-1', descricao: 'Seguro de vida individual', seguradoraNome: 'PORTO SEGURO CIA. DE SEGUROS GERAIS' },
        { nome: 'Vida em Grupo', codigo: '0929-2', descricao: 'Seguro de vida empresarial', seguradoraNome: 'PORTO SEGURO CIA. DE SEGUROS GERAIS' },
        { nome: 'Acidentes Pessoais', codigo: '0929-3', descricao: 'Cobertura para acidentes pessoais', seguradoraNome: 'PORTO SEGURO CIA. DE SEGUROS GERAIS' },
        { nome: 'Seguro Viagem', codigo: '0929-4', descricao: 'Cobertura para acidentes em viagens', seguradoraNome: 'PORTO SEGURO CIA. DE SEGUROS GERAIS' }
      ]
    },
    {
      codigo: '0114',
      nome: 'Residencial',
      descricao: 'Seguros para residências e conteúdo',
      produtos: [
        { nome: 'Residencial Básico', codigo: '0114-1', descricao: 'Cobertura básica residencial', seguradoraNome: 'PORTO SEGURO CIA. DE SEGUROS GERAIS' },
        { nome: 'Residencial Completo', codigo: '0114-2', descricao: 'Cobertura completa residencial', seguradoraNome: 'PORTO SEGURO CIA. DE SEGUROS GERAIS' }
      ]
    },
    {
      codigo: '0118',
      nome: 'Empresarial',
      descricao: 'Seguros para empresas e negócios',
      produtos: [
        { nome: 'Empresarial Básico', codigo: '0118-1', descricao: 'Cobertura básica empresarial', seguradoraNome: 'PORTO SEGURO CIA. DE SEGUROS GERAIS' },
        { nome: 'Empresarial Completo', codigo: '0118-2', descricao: 'Cobertura completa empresarial', seguradoraNome: 'PORTO SEGURO CIA. DE SEGUROS GERAIS' },
        { nome: 'RCF Empresarial', codigo: '0118-3', descricao: 'Responsabilidade Civil Empresarial', seguradoraNome: 'PORTO SEGURO CIA. DE SEGUROS GERAIS' }
      ]
    },
    {
      codigo: '0711',
      nome: 'Riscos de Engenharia',
      descricao: 'Seguros para obras e construções',
      produtos: [
        { nome: 'Obras Civis', codigo: '0711-1', descricao: 'Seguro para obras civis em construção', seguradoraNome: 'PORTO SEGURO CIA. DE SEGUROS GERAIS' },
        { nome: 'Instalação e Montagem', codigo: '0711-2', descricao: 'Seguro para instalação e montagem de equipamentos', seguradoraNome: 'PORTO SEGURO CIA. DE SEGUROS GERAIS' }
      ]
    },
    {
      codigo: '0969',
      nome: 'Saúde',
      descricao: 'Seguros e planos de saúde',
      produtos: [
        { nome: 'Saúde Individual', codigo: '0969-1', descricao: 'Plano de saúde individual', seguradoraNome: 'PREVENT SENIOR PRIVATE OPERADORA DE SAÚDE LTDA' },
        { nome: 'Saúde Empresarial', codigo: '0969-2', descricao: 'Plano de saúde empresarial', seguradoraNome: 'PORTO SEGURO CIA. DE SEGUROS GERAIS' }
      ]
    },
    {
      codigo: '0977',
      nome: 'Previdência',
      descricao: 'Planos de previdência privada',
      produtos: [
        { nome: 'PGBL', codigo: '0977-1', descricao: 'Plano Gerador de Benefício Livre', seguradoraNome: 'PORTO SEGURO CIA. DE SEGUROS GERAIS' },
        { nome: 'VGBL', codigo: '0977-2', descricao: 'Vida Gerador de Benefício Livre', seguradoraNome: 'PORTO SEGURO CIA. DE SEGUROS GERAIS' }
      ]
    },
    {
      codigo: '0234',
      nome: 'Responsabilidade Civil',
      descricao: 'Seguros de responsabilidade civil geral',
      produtos: [
        { nome: 'RC Geral', codigo: '0234-1', descricao: 'Responsabilidade Civil Geral', seguradoraNome: 'PORTO SEGURO CIA. DE SEGUROS GERAIS' },
        { nome: 'D&O', codigo: '0234-2', descricao: 'Responsabilidade Civil de Administradores', seguradoraNome: 'PORTO SEGURO CIA. DE SEGUROS GERAIS' },
        { nome: 'E&O', codigo: '0234-3', descricao: 'Responsabilidade Civil Profissional', seguradoraNome: 'PORTO SEGURO CIA. DE SEGUROS GERAIS' }
      ]
    }
  ];

  try {
    // Criar seguradoras
    const createdSeguradoras = [];
    for (const seguradora of seguradoras) {
      const createdSeguradora = await prisma.seguradora.create({
        data: seguradora
      });
      createdSeguradoras.push(createdSeguradora);
      console.log(`Seguradora ${seguradora.nome} criada com sucesso!`);
    }

    for (const ramo of ramos) {
      // Criar o ramo
      const createdRamo = await prisma.ramo.create({
        data: {
          codigo: ramo.codigo,
          nome: ramo.nome,
          descricao: ramo.descricao,
          ativo: true
        }
      });

      console.log(`Ramo ${ramo.nome} criado com sucesso!`);

      // Criar os produtos associados ao ramo
      for (const produto of ramo.produtos) {
        const seguradora = createdSeguradoras.find(s => s.nome === produto.seguradoraNome);
        if (!seguradora) {
          throw new Error(`Seguradora ${produto.seguradoraNome} não encontrada para o produto ${produto.nome}`);
        }

        await prisma.produto.create({
          data: {
            nome: produto.nome,
            codigo: produto.codigo,
            descricao: produto.descricao,
            ativo: true,
            ramoId: createdRamo.id,
            seguradoraId: seguradora.id
          }
        });

        console.log(`Produto ${produto.nome} criado para o ramo ${ramo.nome} e seguradora ${seguradora.nome}`);
      }
    }

    console.log('Seed de Seguradoras, Ramos e Produtos finalizado com sucesso!');
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erro durante o seed:', error.message);
    } else {
      console.error('Erro durante o seed:', error);
    }
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });