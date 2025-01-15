
import { PrismaClient } from '@prisma/client';
import { AppError } from '@/middlewares/error';

export class ProdutoService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findByRamo(ramoId: number) {
    try {
      return await this.prisma.produto.findMany({
        where: {
          ramoId: ramoId,
          ativo: true
        },
        orderBy: {
          nome: 'asc'
        }
      });
    } catch (error) {
      throw new AppError(`Erro ao listar produtos: ${error}`, 500);
    }
  }
}