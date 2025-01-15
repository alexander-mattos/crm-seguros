import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[cepMask]',
  standalone: true
})
export class CepMaskDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Remove não dígitos
    
    if (value.length > 8) {
      value = value.slice(0, 8);
    }
    
    if (value.length > 5) {
      value = value.slice(0, 5) + '-' + value.slice(5);
    }
    
    input.value = value;
  }

  @HostListener('blur', ['$event'])
  onBlur(event: FocusEvent) {
    const input = event.target as HTMLInputElement;
    if (input.value.length < 9) {
      input.value = '';
    }
  }
}