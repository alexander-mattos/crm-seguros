
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Iniciando seed das seguradoras...');

    const seguradoras = [
        {
            nome: 'PORTO SEGURO CIA. DE SEGUROS GERAIS',
            cnpj: '61198164000160',
            susep: '05886',
            ddd: '11',
            telefone: '3366-3666',
            observacao: 'Uma das maiores seguradoras do Brasil'
        },
        {
            nome: 'BRADESCO AUTO/RE CIA DE SEGUROS',
            cnpj: '33055146000193',
            susep: '05444',
            ddd: '11',
            telefone: '4004-2757',
            observacao: 'Seguradora do grupo Bradesco'
        },
        {
            nome: 'BRADESCO SAÚDE S/A',
            cnpj: '49951667000133',
            susep: '00584',
            ddd: '11',
            telefone: '4004-2757',
            observacao: 'Seguradora do grupo Bradesco'
        },
        {
            nome: 'SULAMÉRICA SEGUROS DE PESSOAS E PREVIDENCIA',
            cnpj: '33041062000109',
            susep: '06785',
            ddd: '11',
            telefone: '3779-7000',
            observacao: 'Especializada em seguros de saúde'
        },
        {
            nome: 'LIBERTY SEGUROS S/A',
            cnpj: '61550141000172',
            susep: '05983',
            ddd: '11',
            telefone: '3556-9999',
            observacao: 'Forte presença em seguros automotivos'
        },
        {
            nome: 'HDI SEGUROS S/A',
            cnpj: '29980158000157',
            susep: '05177',
            ddd: '11',
            telefone: '3348-4000',
            observacao: 'Parte do grupo Talanx'
        },
        {
            nome: 'TOKIO MARINE SEGURADORA S/A',
            cnpj: '33164021000100',
            susep: '06190',
            ddd: '11',
            telefone: '3054-7000',
            observacao: 'Seguradora japonesa com forte presença no Brasil'
        },
        {
            nome: 'ALLIANZ SEGUROS',
            cnpj: '61573796000166',
            susep: '05177',
            ddd: '11',
            telefone: '3171-3000',
            observacao: 'Grupo alemão de serviços financeiros'
        },
        {
            nome: 'MAPFRE VERA CRUZ SEGURADORA S/A',
            cnpj: '61074175000138',
            susep: '06238',
            ddd: '11',
            telefone: '2663-3000',
            observacao: 'Grupo espanhol com forte presença na América Latina'
        },
        {
            nome: 'ZURICH - CIA. DE SEGUROS MINAS BRASIL',
            cnpj: '61383493000180',
            susep: '05495',
            ddd: '11',
            telefone: '4004-4000',
            observacao: 'Seguradora suíça com operações globais'
        },
        {
            nome: 'SOMPO SEGUROS S/A',
            cnpj: '61383493000182',
            susep: '05720',
            ddd: '11',
            telefone: '3156-1000',
            observacao: 'Antiga Marítima Seguros, adquirida pelo grupo japonês Sompo'
        },
        {
            nome: 'AIG SEGUROS BRASIL S/A',
            cnpj: '33053057000104',
            susep: '01414',
            ddd: '11',
            telefone: '3512-2000',
            observacao: 'Seguradora americana com forte presença global'
        },
        {
            nome: 'AMIL ASSISTÊNCIA MÉDICA INTERNACIONAL S/A',
            cnpj: '29150261000160',
            susep: '00584',
            ddd: '11',
            telefone: '4004-2757',
            observacao: null,
        },
        {
            nome: 'AZUL CIA. DE SEGUROS GERAIS',
            cnpj: null,
            susep: '05886',
            ddd: '11',
            telefone: '3366-3666',
            observacao: 'Seguradora do grupo Porto Seguro'
        },
        {
            nome: 'ICATU HARTFORD SEGUROS S/A',
            cnpj: null,
            susep: null,
            ddd: '11',
            telefone: null,
            observacao: null,
        },
        {
            nome: 'INTERMÉDICA SISTEMA DE SAÚDE S/A',
            cnpj: null,
            susep: null,
            ddd: '11',
            telefone: null,
            observacao: 'Seguradora de saúde do grupo NotreDame Intermédica'
        },
        {
            nome: 'ITAÚ SEGUROS S/A',
            cnpj: null,
            susep: null,
            ddd: '11',
            telefone: null,
            observacao: 'Seguradora do grupo Itaú Unibanco'
        },
        {
            nome: 'PREVENT SENIOR PRIVATE OPERADORA DE SAÚDE LTDA',
            cnpj: null,
            susep: null,
            ddd: null,
            telefone: null,
            observacao: 'Seguradora de saúde especializada em idosos'
        }
    ];

    console.log('Limpando dados existentes...');
    try {
        await prisma.seguradora.deleteMany({});
        console.log('Dados existentes removidos com sucesso.');
    } catch (error) {
        console.error('Erro ao limpar dados:', error);
        return;
    }

    try {
        // Inserir uma seguradora por vez e tratar possíveis erros
        for (const seguradora of seguradoras) {
            try {
                // Se não tem CNPJ, gera um temporário único
                if (!seguradora.cnpj) {
                    seguradora.cnpj = `TEMP${Math.random().toString(36).substring(2, 15)}`;
                }

                const result = await prisma.seguradora.create({
                    data: {
                        nome: seguradora.nome,
                        cnpj: seguradora.cnpj,
                        susep: seguradora.susep || null,
                        ddd: seguradora.ddd || null,
                        telefone: seguradora.telefone || null,
                        ddd2: null,
                        telefone2: null,
                        observacao: seguradora.observacao || null,
                    }
                });
                console.log(`Seguradora ${result.nome} criada com sucesso!`);
            } catch (error) {
                if (error instanceof Prisma.PrismaClientKnownRequestError) {
                    if (error.code === 'P2002') {
                        console.error(`CNPJ duplicado para seguradora ${seguradora.nome}. Pulando...`);
                        continue;
                    }
                }
                throw error;
            }
        }

        console.log('Seed finalizado com sucesso!');
    } catch (error) {
        if (error instanceof Error) {
            console.error('Erro ao criar seguradoras:', error.message);
        } else {
            console.error('Erro ao criar seguradoras:', error);
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