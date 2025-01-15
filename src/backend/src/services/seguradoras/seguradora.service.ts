// backend/src/services/seguradoras/seguradora.service.ts
import { PrismaClient } from '@prisma/client';
import { AppError } from '../../middlewares/error';

export class SeguradoraService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll() {
    try {
      return await this.prisma.seguradora.findMany({
        where: {
          cnpj: {
            not: null
          }
        },
        orderBy: {
          nome: 'asc'
        }
      });
    } catch (error) {
      throw new AppError(`Erro ao listar seguradoras: ${error}`, 500);
    }
  }
}