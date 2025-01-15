import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat'
})
export class CurrencyFormatPipe implements PipeTransform {

  transform(value: number | string): string {
    if (value == null) return '';
    const numberValue = typeof value === 'string' ? parseFloat(value) : value;

    return numberValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

}