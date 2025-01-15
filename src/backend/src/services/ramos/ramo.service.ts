import { PrismaClient } from '@prisma/client';
import { AppError } from '../../middlewares/error';

export class RamoService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll() {
    try {
      return await this.prisma.ramo.findMany({
        where: {
          ativo: true
        },
        orderBy: {
          nome: 'asc'
        }
      });
    } catch (error) {
      throw new AppError(`Erro ao listar ramos: ${error}`, 500);
    }
  }
}