import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appCurrencyMask]',
  standalone: true
})
export class CurrencyMaskDirective {
  private lastValue = '';

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Remove todos os caracteres que não são números
    const numericValue = value.replace(/\D/g, '');

    // Se o valor é vazio ou zero, reseta o campo
    if (!numericValue) {
      this.lastValue = '';
      input.value = '';
      return;
    }

    // Converte para um número com duas casas decimais
    const floatValue = (parseFloat(numericValue) / 100).toFixed(2);
    
    // Formata o valor para moeda
    const formattedValue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(parseFloat(floatValue));

    // Calcula a posição do cursor
    const cursorDiff = formattedValue.length - this.lastValue.length;
    const cursorPosition = (input.selectionStart || 0) + cursorDiff;

    // Atualiza o valor do input
    this.lastValue = formattedValue;
    input.value = formattedValue;

    // Reposiciona o cursor
    setTimeout(() => {
      input.setSelectionRange(cursorPosition, cursorPosition);
    }, 0);
  }
}