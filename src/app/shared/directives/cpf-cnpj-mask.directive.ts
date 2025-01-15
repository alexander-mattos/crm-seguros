import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[cpfCnpjMask]',
  standalone: true
})
export class CpfCnpjMaskDirective {
  @Input('cpfCnpjMask') tipoPessoa: string = 'F';

  constructor(private el: ElementRef) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Permitir backspace e delete
    if (event.key === 'Backspace' || event.key === 'Delete') {
      return;
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (this.tipoPessoa === 'F') {
      if (value.length > 11) {
        value = value.slice(0, 11);
      }
      if (value.length <= 11) {
        value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*/, '$1.$2.$3-$4');
      }
    } else {
      if (value.length > 14) {
        value = value.slice(0, 14);
      }
      if (value.length <= 14) {
        value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*/, '$1.$2.$3/$4-$5');
      }
    }

    input.value = value;
  }
}