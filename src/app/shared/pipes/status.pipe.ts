import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusCliente',
  standalone: true
})
export class StatusClientePipe implements PipeTransform {
  transform(value: string, tipo: 'texto' | 'classe' = 'texto'): string {
    const status: { [key: string]: { texto: string; classe: string } } = {
      '0': { texto: 'NÃO INFORMADO', classe: 'status-nao-informado' },
      '1': { texto: 'CLIENTE', classe: 'status-cliente' },
      '2': { texto: 'PROSPECT', classe: 'status-prospect' },
      '3': { texto: 'PARCEIRO', classe: 'status-parceiro' },
      '8': { texto: 'INATIVO', classe: 'status-inativo' }
    };

    if (tipo === 'classe') {
      return status[value]?.classe || '';
    }
    return status[value]?.texto || value;
  }
}