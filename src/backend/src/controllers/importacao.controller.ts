import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ITelefone } from '../shared/types/telefone.types';
import { IEnderecoForm, TipoEndereco } from '../shared/types/endereco.types';
import { IClienteImportacao } from '../shared/types/cliente.types';

const prisma = new PrismaClient();

export class ImportacaoController {
  async importarClientes(req: Request, res: Response) {
    try {
      const transaction = await prisma.$transaction(async (tx) => {
        const clientesData: IClienteImportacao[] = Array.isArray(req.body) ? req.body : [req.body];
        const resultados = [];

        // Início do loop de processamento de clientes
        for (const clienteData of clientesData) {
          try {
            // Verificação e processamento do cliente
            const clienteExistente = await tx.cliente.findUnique({
              where: {
                cnpjCpf: clienteData.cnpjCpf
              }
            });

            let cliente;
            if (clienteExistente) {
              cliente = await tx.cliente.update({
                where: { id: clienteExistente.id },
                data: {
                  nome: clienteData.nome,
                  tipoPessoa: clienteData.tipoPessoa,
                  status: clienteData.status || '1',
                  email: clienteData.email,
                  dtAlteracao: new Date()
                }
              });

              await tx.telefone.deleteMany({
                where: { clienteId: cliente.id }
              });

              await tx.endereco.deleteMany({
                where: { clienteId: cliente.id }
              });
            } else {
              cliente = await tx.cliente.create({
                data: {
                  nome: clienteData.nome,
                  tipoPessoa: clienteData.tipoPessoa,
                  cnpjCpf: clienteData.cnpjCpf,
                  status: clienteData.status || '1',
                  email: clienteData.email,
                  lgpd: 'S',
                  dtInclusao: new Date()
                }
              });
            }

            // Processamento dos telefones
            if (Array.isArray(clienteData.telefones) && clienteData.telefones.length > 0) {
              const telefonesProcessados = clienteData.telefones.map((tel: ITelefone) => ({
                clienteId: cliente.id,
                tipo: tel.tipo,
                numero: this.limparNumeroTelefone(tel.numero),
                ramal: tel.ramal,
                contato: tel.contato
              }));

              await tx.telefone.createMany({ data: telefonesProcessados });
            }

            // Processamento dos endereços
            if (Array.isArray(clienteData.enderecos) && clienteData.enderecos.length > 0) {
              console.log(`\nProcessando endereços para ${clienteData.nome}:`);
              console.log('Endereços recebidos:', JSON.stringify(clienteData.enderecos, null, 2));

              const enderecosValidos = clienteData.enderecos
                .filter((end: IEnderecoForm) => {
                  // Verificação mais detalhada dos campos
                  const camposObrigatorios = {
                    endereco: end.endereco?.trim(),
                    bairro: end.bairro?.trim(),
                    cidade: end.cidade?.trim(),
                    estado: end.estado?.trim(),
                    cep: end.cep?.trim()
                  };

                  console.log('Validando campos do endereço:', camposObrigatorios);

                  const enderecoValido = Object.values(camposObrigatorios).every(campo => campo && campo.length > 0);

                  if (!enderecoValido) {
                    console.log('Campos faltantes:',
                      Object.entries(camposObrigatorios)
                        .filter(([_, valor]) => !valor)
                        .map(([campo]) => campo)
                    );
                  }

                  return enderecoValido;
                })
                .map((end: IEnderecoForm) => {
                  const enderecoProcessado = {
                    clienteId: cliente.id,
                    tipo: this.validarTipoEndereco(end.tipo),
                    cep: this.limparNumero(end.cep),
                    endereco: end.endereco.trim(),
                    numero: end.numero || 'S/N',
                    complemento: end.complemento?.trim(),
                    bairro: end.bairro.trim(),
                    cidade: end.cidade.trim(),
                    estado: end.estado.trim().toUpperCase(),
                    correspondencia: end.correspondencia || 'N'
                  };

                  console.log('Endereço processado:', enderecoProcessado);
                  return enderecoProcessado;
                });

              if (enderecosValidos.length > 0) {
                try {
                  await tx.endereco.createMany({ data: enderecosValidos });
                  console.log(`✓ ${enderecosValidos.length} endereços importados para ${cliente.nome}`);
                } catch (enderecoError) {
                  console.error('Erro ao criar endereços:', enderecoError);
                  throw enderecoError;
                }
              } else {
                console.log(`⚠ Nenhum endereço válido para importar para ${cliente.nome}`);
              }
            }

            // Adiciona o resultado do processamento
            resultados.push({
              sucesso: true,
              clienteId: cliente.id,
              mensagem: `Cliente ${clienteExistente ? 'atualizado' : 'criado'} com sucesso`
            });

          } catch (clienteError) {
            console.error(`Erro ao processar cliente ${clienteData.nome}:`, clienteError);
            resultados.push({
              sucesso: false,
              clienteNome: clienteData.nome,
              mensagem: 'Erro ao processar cliente',
              erro: clienteError instanceof Error ? clienteError.message : 'Erro desconhecido'
            });
          }
        } // Fim do loop de clientes

        return { sucesso: true, resultados };
      }); // Fim da transação

      return res.status(200).json(transaction);

    } catch (error) {
      console.error('Erro na transação:', error);
      return res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao processar importação',
        erro: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  private validarTipoEndereco(tipo: string): TipoEndereco {
    if (Object.values(TipoEndereco).includes(tipo as TipoEndereco)) {
      return tipo as TipoEndereco;
    }
    console.warn(`Tipo de endereço inválido: ${tipo}. Usando RESIDENCIAL como padrão.`);
    return TipoEndereco.RESIDENCIAL;
  }

  private limparNumeroTelefone(numero: string): string {
    return numero.replace(/\D/g, '');
  }

  private limparNumero(numero: string): string {
    return numero.replace(/\D/g, '');
  }
}