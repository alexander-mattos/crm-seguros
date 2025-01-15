import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moedaBrasileira',
  standalone: true
})
export class MoedaBrasileiraPipe implements PipeTransform {
  transform(valor: number | string | null | undefined): string {
    if (valor === null || valor === undefined) return 'R$ 0,00';

    const valorNumerico = typeof valor === 'string' ? parseFloat(valor) : valor;

    if (isNaN(valorNumerico)) return 'R$ 0,00';

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valorNumerico);
  }
}