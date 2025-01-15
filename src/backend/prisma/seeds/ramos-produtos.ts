
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed de Ramos e Produtos...');

  // Limpar dados existentes
  await prisma.produto.deleteMany({});
  await prisma.ramo.deleteMany({});

  const ramos = [
    {
      codigo: '0531',
      nome: 'Automóvel',
      descricao: 'Seguros relacionados a veículos automotores',
      produtos: [
        { nome: 'Seguro Auto', codigo: '0531-1', descricao: 'Cobertura básica para automóveis' },
        { nome: 'RCF-V', codigo: '0531-2', descricao: 'Responsabilidade Civil Facultativa de Veículos' },
        { nome: 'APP', codigo: '0531-3', descricao: 'Acidentes Pessoais de Passageiros' }
      ]
    },
    {
      codigo: '0929',
      nome: 'Vida',
      descricao: 'Seguros de vida e acidentes pessoais',
      produtos: [
        { nome: 'Vida Individual', codigo: '0929-1', descricao: 'Seguro de vida individual' },
        { nome: 'Vida em Grupo', codigo: '0929-2', descricao: 'Seguro de vida empresarial' },
        { nome: 'Acidentes Pessoais', codigo: '0929-3', descricao: 'Cobertura para acidentes pessoais' },
        { nome: 'Seguro Viagem', codigo: '0929-4', descricao: 'Cobertura para acidentes em viagens' }
      ]
    },
    {
      codigo: '0114',
      nome: 'Residencial',
      descricao: 'Seguros para residências e conteúdo',
      produtos: [
        { nome: 'Residencial Básico', codigo: '0114-1', descricao: 'Cobertura básica residencial' },
        { nome: 'Residencial Completo', codigo: '0114-2', descricao: 'Cobertura completa residencial' }
      ]
    },
    {
      codigo: '0118',
      nome: 'Empresarial',
      descricao: 'Seguros para empresas e negócios',
      produtos: [
        { nome: 'Empresarial Básico', codigo: '0118-1', descricao: 'Cobertura básica empresarial' },
        { nome: 'Empresarial Completo', codigo: '0118-2', descricao: 'Cobertura completa empresarial' },
        { nome: 'RCF Empresarial', codigo: '0118-3', descricao: 'Responsabilidade Civil Empresarial' }
      ]
    },
    {
      codigo: '0711',
      nome: 'Riscos de Engenharia',
      descricao: 'Seguros para obras e construções',
      produtos: [
        { nome: 'Obras Civis', codigo: '0711-1', descricao: 'Seguro para obras civis em construção' },
        { nome: 'Instalação e Montagem', codigo: '0711-2', descricao: 'Seguro para instalação e montagem de equipamentos' }
      ]
    },
    {
      codigo: '0969',
      nome: 'Saúde',
      descricao: 'Seguros e planos de saúde',
      produtos: [
        { nome: 'Saúde Individual', codigo: '0969-1', descricao: 'Plano de saúde individual' },
        { nome: 'Saúde Empresarial', codigo: '0969-2', descricao: 'Plano de saúde empresarial' }
      ]
    },
    {
      codigo: '0977',
      nome: 'Previdência',
      descricao: 'Planos de previdência privada',
      produtos: [
        { nome: 'PGBL', codigo: '0977-1', descricao: 'Plano Gerador de Benefício Livre' },
        { nome: 'VGBL', codigo: '0977-2', descricao: 'Vida Gerador de Benefício Livre' }
      ]
    },
    {
      codigo: '0234',
      nome: 'Responsabilidade Civil',
      descricao: 'Seguros de responsabilidade civil geral',
      produtos: [
        { nome: 'RC Geral', codigo: '0234-1', descricao: 'Responsabilidade Civil Geral' },
        { nome: 'D&O', codigo: '0234-2', descricao: 'Responsabilidade Civil de Administradores' },
        { nome: 'E&O', codigo: '0234-3', descricao: 'Responsabilidade Civil Profissional' }
      ]
    }
  ];

  try {
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
        await prisma.produto.create({
          data: {
            nome: produto.nome,
            codigo: produto.codigo,
            descricao: produto.descricao,
            ativo: true,
            ramoId: createdRamo.id
          }
        });
        console.log(`Produto ${produto.nome} criado para o ramo ${ramo.nome}`);
      }
    }

    console.log('Seed de Ramos e Produtos finalizado com sucesso!');
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