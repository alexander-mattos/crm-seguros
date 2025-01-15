import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[telefoneMask]'
})
export class TelefoneMaskDirective {

  @HostListener('input', ['$event'])
  onInput(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    const start = input.selectionStart || 0;

    // Remove tudo que não é número
    let value = input.value.replace(/\D/g, '');

    // Limita a 11 dígitos
    if (value.length > 11) {
      value = value.slice(0, 11);
    }

    // Formata o valor
    let formattedValue = '';
    let cursorPos = start;
    
    if (value.length > 0) {
      // Formato: (99)
      formattedValue = '(' + value.slice(0, 2);
      
      if (value.length > 2) {
        // Formato: (99) 
        formattedValue += ') ';
        
        if (value.length <= 10) {
          // Formato: (99) 9999-9999
          formattedValue += value.slice(2, 6);
          if (value.length > 6) {
            formattedValue += '-' + value.slice(6, 10);
          }
        } else {
          // Formato: (99) 99999-9999
          formattedValue += value.slice(2, 7);
          if (value.length > 7) {
            formattedValue += '-' + value.slice(7, 11);
          }
        }
      }
    }

    // Atualiza o valor
    input.value = formattedValue;

    // Calcula a posição do cursor
    if (value.length <= 2) {
      cursorPos = formattedValue.length;
    } else {
      const addedChars = formattedValue.length - value.length;
      cursorPos = start + (start >= 2 ? addedChars : 0);
    }

    // Define a posição do cursor
    requestAnimationFrame(() => {
      input.setSelectionRange(cursorPos, cursorPos);
    });

    // Validação
    const regex = /^\([1-9]{2}\) (?:[2-9][0-9]{3}-[0-9]{4}|[9][0-9]{4}-[0-9]{4})$/;
    if (value.length > 0) {
      input.setCustomValidity(regex.test(formattedValue) ? "" : "Número de telefone inválido");
    } else {
      input.setCustomValidity("");
    }
  }
}