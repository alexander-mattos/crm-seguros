import { PrismaClient, Prisma } from '@prisma/client';
import { AppError } from '../middlewares/error';


export class RamosService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient({
            log: ['query', 'error', 'info', 'warn'],
        });
    }

    async findAllRamos() {
        try {
            console.log('Iniciando busca de ramos...');
            const ramos = await this.prisma.ramo.findMany({
                orderBy: {
                  createdAt: 'desc'
                }
            });
            console.log(`Ramos encontrados: ${ramos.length}`);
            return ramos;
        } catch (error) {
            console.error('Erro ao buscar ramos:', error);
            throw new AppError(
                `Erro ao listar ramos: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
                500
            );
        }
    }
}