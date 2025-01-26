import { PrismaClient, Prisma } from '@prisma/client';
import { AppError } from '../middlewares/error';
import { Seguradoras } from '../models/seguradoras.model';

export class SeguradorasService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient({
            log: ['query', 'error', 'info', 'warn'],
        });
    }

    async createSeguradoras(data: Seguradoras) {
        try {
            const seguradoras: Prisma.SeguradoraCreateInput = {
                nome: data.nome,
                susep: data.susep,
                ddd: data.ddd,
                ddd2: data.ddd2,
                telefone: data.telefone,
                telefone2: data.telefone2,
                createdAt: data.createdAt || new Date(),
                updatedAt: data.updatedAt
            };

            return await this.prisma.seguradora.create({
                data: seguradoras
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new AppError('Já existe uma seguradora com este nome', 400);
                }
            }
            throw new AppError(
                `Erro ao criar seguradora: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
                400
            );
        }
    }

    async findAllSeguradoras() {
        try {
            console.log('Iniciando busca de seguradoras...');
            const seguradoras = await this.prisma.seguradora.findMany({
                orderBy: {
                  createdAt: 'desc'
                }
            });
            console.log(`Seguradoras encontradas: ${seguradoras.length}`);
            return seguradoras;
        } catch (error) {
            console.error('Erro ao buscar seguradoras:', error);
            throw new AppError(
                `Erro ao listar seguradoras: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
                500
            );
        }
    }

    async findById(id: number) {
        try {
            const seguradoras = await this.prisma.seguradora.findUnique({
                where: { id }
            });

            if (!seguradoras) {
                throw new AppError('Seguradora não encontrado', 404);
            }

            return seguradoras;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(
                `Erro ao buscar seguradora: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
                500
            );
        }
    }

    async delete(id: number) {
        try {
            const seguradoras = await this.prisma.seguradora.delete({
                where: { id }
            });
            return seguradoras;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new AppError('Seguradora não encontrado', 404);
                }
            }
            throw new AppError(
                `Erro ao excluir seguradora: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
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
                AND table_name = 'Seguradora'
            `;
            console.log('Verificação da tabela:', tableExists);

            // Verificar estrutura
            const columns = await this.prisma.$queryRaw`
                SHOW COLUMNS FROM Seguradora
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