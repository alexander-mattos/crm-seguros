import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[mesAnoMask]',
    standalone: true
  })
  export class MesAnoMaskDirective {
    constructor(private el: ElementRef) {}
  
    @HostListener('input', ['$event'])
    onInput(event: any) {
      let value = event.target.value.replace(/\D/g, '');
      
      if (value.length > 0) {
        if (value.length > 2) {
          const mes = value.substring(0, 2);
          const ano = value.substring(2, 6);
          if (parseInt(mes) > 12) {
            value = '12' + ano;
          }
          value = mes + '/' + ano;
        }
        value = value.substring(0, 7);
      }
      
      event.target.value = value;
    }
  }