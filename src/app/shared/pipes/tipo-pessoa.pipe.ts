import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tipoPessoa',
  standalone: true
})
export class TipoPessoaPipe implements PipeTransform {
  transform(value: string): string {
    const tipos: { [key: string]: string } = {
      'F': 'FÍSICA',
      'J': 'JURÍDICA'
    };
    return tipos[value] || value;
  }
}