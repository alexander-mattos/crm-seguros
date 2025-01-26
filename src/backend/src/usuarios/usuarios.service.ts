import { PrismaClient, Prisma } from '@prisma/client';
import { AppError } from '../middlewares/error';
import { Usuario } from '..//models/usuarios.models';

export class UsuariosService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient({
            log: ['query', 'error', 'info', 'warn'],
        });
    }

    async createUsuario(data: Usuario) {
        try {
            const usuarioData: Prisma.UsuarioCreateInput = {
                status: data.status,
                nome: data.nome,
                gestor: data.gestor || null,
                telefone: data.telefone || null,
                celular: data.celular || null,
                administrador: data.administrador === '1',
                emailDiario: data.emailDiario,
                criadoPor: data.criadoPor,
                dataCriacao: data.dataCriacao || new Date(),
                email: data.email
            };

            return await this.prisma.usuario.create({
                data: usuarioData
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new AppError('Já existe um usuário com este E-mail', 400);
                }
            }
            throw new AppError(
                `Erro ao criar usuário: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
                400
            );
        }
    }

    async findAllUsuarios() {
        try {
            console.log('Iniciando busca de usuários...');
            const usuarios = await this.prisma.usuario.findMany({
                orderBy: {
                  dataCriacao: 'desc'
                }
            });
            console.log(`Usuários encontrados: ${usuarios.length}`);
            return usuarios;
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            throw new AppError(
                `Erro ao listar usuarios: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
                500
            );
        }
    }

    async findById(id: number) {
        try {
            const usuario = await this.prisma.usuario.findUnique({
                where: { id }
            });

            if (!usuario) {
                throw new AppError('Usuário não encontrado', 404);
            }

            return usuario;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(
                `Erro ao buscar usuario: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
                500
            );
        }
    }

    async delete(id: number) {
        try {
            const usuario = await this.prisma.usuario.delete({
                where: { id }
            });
            return usuario;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new AppError('Usuário não encontrado', 404);
                }
            }
            throw new AppError(
                `Erro ao excluir usuário: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
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
                AND table_name = 'usuarios'
            `;
            console.log('Verificação da tabela:', tableExists);

            // Verificar estrutura
            const columns = await this.prisma.$queryRaw`
                SHOW COLUMNS FROM usuarios
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