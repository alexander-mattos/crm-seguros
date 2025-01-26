import { PrismaClient, Prisma } from '@prisma/client';
import { AppError } from '../middlewares/error';
import { UnidadeNegocio } from '../models/unidadenegocio.model';

export class UnidadeNegocioService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient({
            log: ['query', 'error', 'info', 'warn'],
        });
    }

    async createUnidadeNegocio(data: UnidadeNegocio) {
        try {
            const unidadeNegocioData: Prisma.UnidadeNegocioCreateInput = {
                nome: data.nome,
                responsavel: data.responsavel,
                susep: data.susep,
                email: data.email,
                cep: data.cep,
                endereco: data.endereco,
                numero: data.numero,
                complemento: data.complemento,
                bairro: data.bairro,
                cidade: data.cidade,
                estado: data.estado,
                telefone1: data.telefone1,
                telefone2: data. telefone2,
                celular: data.celular,
                dataCriacao: data.dataCriacao || new Date(),
                dataAlteracao: data.dataAlteracao
            };

            return await this.prisma.unidadeNegocio.create({
                data: unidadeNegocioData
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new AppError('Já existe uma unidade de negócio com este e-mail', 400);
                }
            }
            throw new AppError(
                `Erro ao criar unidade de negócio: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
                400
            );
        }
    }

    async findAllUnidadeNegocio() {
        try {
            console.log('Iniciando busca de unidades...');
            const unidadeNegocio = await this.prisma.unidadeNegocio.findMany({
                orderBy: {
                  dataCriacao: 'desc'
                }
            });
            console.log(`Unidades encontradas: ${unidadeNegocio.length}`);
            return unidadeNegocio;
        } catch (error) {
            console.error('Erro ao buscar unidades:', error);
            throw new AppError(
                `Erro ao listar unidades: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
                500
            );
        }
    }

    async findById(id: number) {
        try {
            const unidadeNegocio = await this.prisma.unidadeNegocio.findUnique({
                where: { id }
            });

            if (!unidadeNegocio) {
                throw new AppError('Unidade não encontrado', 404);
            }

            return unidadeNegocio;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(
                `Erro ao buscar unidade: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
                500
            );
        }
    }

    async delete(id: number) {
        try {
            const unidadeNegocio = await this.prisma.unidadeNegocio.delete({
                where: { id }
            });
            return unidadeNegocio;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new AppError('Unidade não encontrado', 404);
                }
            }
            throw new AppError(
                `Erro ao excluir unidade: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
                500
            );
        }
    }

    async checkDatabaseSchema() {
        try {
            // Verificar conexão
            await this.prisma.$queryRaw`SELECT 1 as test`;
            console.log('Conexão com banco de dados OK');

            // Verificar tabela
            const tableExists = await this.prisma.$queryRaw`
                SELECT COUNT(*) as count 
                FROM information_schema.tables 
                WHERE table_schema = DATABASE() 
                AND table_name = 'UnidadeNegocio'
            `;
            console.log('Verificação da tabela:', tableExists);

            // Verificar estrutura
            const columns = await this.prisma.$queryRaw`
                SHOW COLUMNS FROM UnidadeNegocio
            `;

            return {
                connection: 'OK',
                table: tableExists,
                columns: columns
            };
        } catch (error) {
            console.error('Erro durante verificação:', error);
            throw new AppError(
                `Erro ao verificar banco de dados: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
                500
            );
        }
    }
}