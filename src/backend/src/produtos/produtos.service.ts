import { PrismaClient, Prisma } from '@prisma/client';
import { AppError } from '../middlewares/error';
import { Produtos, ProdutoFormatado } from '../models/produtos.model';

export class ProdutosService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient({
            log: ['query', 'error', 'info', 'warn'],
        });
    }

    async createProduto(data: Produtos) {
        try {
            console.log('Dados recebidos:', data);

            // Validações básicas
            if (!data.nome || !data.codigo) {
                throw new AppError('Nome e código são obrigatórios', 400);
            }

            if (!data.seguradoraId || !data.ramoId) {
                throw new AppError('Seguradora e Ramo são obrigatórios', 400);
            }

            const produto = await this.prisma.produto.create({
                data: {
                    nome: String(data.nome),
                    codigo: String(data.codigo),
                    descricao: data.descricao || null,
                    ativo: data.ativo === true,
                    exibirNoOrcamento: data.exibirNoOrcamento === true,
                    seguradoraId: Number(data.seguradoraId),
                    ramoId: Number(data.ramoId),
                    comissaoSobreAdicional: data.comissaoSobreAdicional === true,
                    iof: data.iof ? new Prisma.Decimal(data.iof) : new Prisma.Decimal(0),
                    seguroPorAssinatura: data.seguroPorAssinatura === true,
                    valorPrimeira: data.valorPrimeira ? new Prisma.Decimal(data.valorPrimeira) : new Prisma.Decimal(0),
                    valorDemais: data.valorDemais ? new Prisma.Decimal(data.valorDemais) : new Prisma.Decimal(0),
                    questionarioDeVenda: data.questionarioDeVenda || null,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                include: {
                    seguradora: true,
                    ramo: true
                }
            });

            console.log('Produto criado:', produto);
            return produto;

        } catch (error) {
            console.error('Erro detalhado:', error);

            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new AppError('Já existe um produto com este nome', 400);
                }
                if (error.code === 'P2003') {
                    throw new AppError('Seguradora ou Ramo não encontrado', 400);
                }
            }

            if (error instanceof AppError) {
                throw error;
            }

            throw new AppError(
                `Erro ao criar produto: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
                400
            );
        }
    }

    async findAllProdutos(page = 1, pageSize = 10) {
        try {
            page = Number(page);
            pageSize = Number(pageSize);
            const skip = (page - 1) * pageSize;

            const [produtos, total] = await Promise.all([
                this.prisma.produto.findMany({
                    skip,
                    take: pageSize,
                    orderBy: { nome: 'asc' },
                    include: {
                        seguradora: true,
                        ramo: true,
                    },
                }),
                this.prisma.produto.count()
            ]);

            return {
                success: true,
                data: produtos,
                total,
                page,
                pageSize
            };
        } catch (error) {
            throw new AppError('Erro ao listar produtos', 500);
        }
    }

    async findById(id: number) {
        try {
            const produtos = await this.prisma.produto.findUnique({
                where: { id }
            });

            if (!produtos) {
                throw new AppError('Produto não encontrado', 404);
            }

            return produtos;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(
                `Erro ao buscar produto: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
                500
            );
        }
    }

    async delete(id: number) {
        try {
            const produtos = await this.prisma.produto.delete({
                where: { id }
            });
            return produtos;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new AppError('Produto não encontrado', 404);
                }
            }
            throw new AppError(
                `Erro ao excluir produto: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
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
                AND table_name = 'Produto'
            `;
            console.log('Verificação da tabela:', tableExists);

            // Verificar estrutura
            const columns = await this.prisma.$queryRaw`
                SHOW COLUMNS FROM Produto
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