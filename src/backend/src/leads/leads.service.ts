import { PrismaClient, Prisma } from '@prisma/client';
import { AppError } from '../middlewares/error';
import { Lead } from '@/models/leads.model';

export class LeadsService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient({
            log: ['query', 'error', 'info', 'warn'],
        });
    }

    async createLead(data: Lead) {
        try {
            const leadData: Prisma.LeadCreateInput = {
                status: data.status,
                origem: data.origem || null,
                nome: data.nome,
                empresa: data.empresa || null,
                atividade: data.atividade || null,
                celular: data.celular || null,
                telcomercial: data.telcomercial || null,
                telresidencial: data.telresidencial || null,
                tipoPessoa: data.tipoPessoa || null,
                cpfCnpj: data.cpfCnpj || null,
                setor: data.setor || null,
                email: data.email || null,
                site: data.site || null,
                cep: data.cep || null,
                endereco: data.endereco || null,
                numero: data.numero || null,
                complemento: data.complemento || null,
                bairro: data.bairro || null,
                cidade: data.cidade || null,
                estado: data.estado || null,
                receita: data.receita || null,
                nrFuncionarios: data.nrFuncionarios || null,
                descricao: data.descricao || null
            };

            return await this.prisma.lead.create({
                data: leadData
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new AppError('Já existe um lead com este CPF/CNPJ', 400);
                }
            }
            throw new AppError(
                `Erro ao criar lead: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
                400
            );
        }
    }

    async findAllLeads() {
        try {
            console.log('Iniciando busca de leads...');
            const leads = await this.prisma.lead.findMany({
                orderBy: {
                    createdAt: 'desc'
                }
            });
            console.log(`Leads encontrados: ${leads.length}`);
            return leads;
        } catch (error) {
            console.error('Erro ao buscar leads:', error);
            throw new AppError(
                `Erro ao listar leads: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
                500
            );
        }
    }

    async findById(id: number) {
        try {
            const lead = await this.prisma.lead.findUnique({
                where: { id }
            });

            if (!lead) {
                throw new AppError('Lead não encontrado', 404);
            }

            return lead;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(
                `Erro ao buscar lead: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
                500
            );
        }
    }

    async delete(id: number) {
        try {
            const lead = await this.prisma.lead.delete({
                where: { id }
            });
            return lead;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new AppError('Lead não encontrado', 404);
                }
            }
            throw new AppError(
                `Erro ao excluir lead: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
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
                AND table_name = 'leads'
            `;
            console.log('Verificação da tabela:', tableExists);

            // Verificar estrutura
            const columns = await this.prisma.$queryRaw`
                SHOW COLUMNS FROM leads
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