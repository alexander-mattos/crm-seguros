import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[mask]',
  standalone: true
})
export class InputMaskDirective {
  @Input('mask') maskType: string = '';

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    switch (this.maskType) {
      case 'cpf':
        value = this.formatCPF(value);
        break;
      case 'cnpj':
        value = this.formatCNPJ(value);
        break;
      case 'phone':
        value = this.formatPhone(value);
        break;
      case 'mesAno':
        value = this.formatMesAno(value);
        break;
      case 'currency':
        value = this.formatCurrency(value);
        break;
    }

    input.value = value;
  }

  private formatCPF(value: string): string {
    if (value.length <= 11) {
      return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value.substring(0, 11);  // Alterado de substr para substring
  }

  private formatCNPJ(value: string): string {
    if (value.length <= 14) {
      return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return value.substring(0, 14);  // Alterado de substr para substring
  }

  private formatPhone(value: string): string {
    if (value.length <= 11) {
      return value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value.substring(0, 11);  // Alterado de substr para substring
  }

  private formatMesAno(value: string): string {
    if (value.length <= 6) {
      return value.replace(/(\d{2})(\d{4})/, '$1/$2');
    }
    return value.substring(0, 6);  // Alterado de substr para substring
  }

  private formatCurrency(value: string): string {
    if (value.length > 0) {
      const number = Number(value) / 100;
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(number);
    }
    return '';
  }
}