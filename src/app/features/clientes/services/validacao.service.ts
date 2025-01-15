import { Injectable } from '@angular/core';
import { IClienteImportacao } from '@/app/shared/interfaces/cliente.interface';

@Injectable({
    providedIn: 'root'
  })
  export class ValidacaoService {
    validarCliente(cliente: IClienteImportacao): boolean {
      const validacoes = [
        this.validarCamposBasicos(cliente),
        this.validarTelefones(cliente.telefones),
        this.validarEnderecos(cliente.enderecos),
        this.validarDocumento(cliente.cnpjCpf, cliente.tipoPessoa),
        cliente.tipoPessoa === 'F' ? this.validarPessoaFisica(cliente) : true
      ];
  
      return validacoes.every(v => v === true);
    }
  
    private validarCamposBasicos(cliente: IClienteImportacao): boolean {
      return Boolean(
        cliente.nome?.trim() &&
        ['F', 'J'].includes(cliente.tipoPessoa) &&
        cliente.status?.trim()
      );
    }
  
    private validarTelefones(telefones: any[]): boolean {
      return telefones.length > 0 && telefones.every(tel => 
        tel.numero?.trim().length >= 8 &&
        ['1', '2', '4', '5'].includes(tel.tipo)
      );
    }
  
    private validarEnderecos(enderecos: any[]): boolean {
      return enderecos.length > 0 && enderecos.every(end => 
        end.cep?.length === 8 &&
        end.endereco?.trim() &&
        end.bairro?.trim() &&
        end.cidade?.trim() &&
        end.estado?.length === 2
      );
    }
  
    private validarDocumento(doc: string | undefined, tipo: string): boolean {
      if (!doc) return false;
      const numerosSomente = doc.replace(/\D/g, '');
      
      return tipo === 'F' ? 
        numerosSomente.length === 11 : 
        numerosSomente.length === 14;
    }
  
    private validarPessoaFisica(cliente: IClienteImportacao): boolean {
      return Boolean(
        cliente.rg?.trim() &&
        cliente.emissor?.trim()
      );
    }
  }