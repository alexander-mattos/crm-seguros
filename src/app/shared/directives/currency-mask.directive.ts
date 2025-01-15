import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[currencyMask]',
  standalone: true
})
export class CurrencyMaskDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    value = (parseInt(value) / 100).toFixed(2);
    event.target.value = value.replace('.', ',');
    event.target.value = `R$ ${event.target.value.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  }
}