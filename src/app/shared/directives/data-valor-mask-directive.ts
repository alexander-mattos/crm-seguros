import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[valorFormatado]',
  standalone: true
})
export class ValorFormatadoDirective implements OnInit {
  @Input('valorFormatado') tipo: 'moeda' | 'data' = 'moeda';

  constructor(
    private el: ElementRef<HTMLInputElement>, 
    private ngControl: NgControl
  ) {}

  ngOnInit() {
    if (this.ngControl.value) {
      if (this.tipo === 'moeda') {
        this.formatarMoeda();
      } else if (this.tipo === 'data') {
        this.formatarData();
      }
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: InputEvent) {
    if (this.tipo === 'moeda') {
      this.formatarMoeda();
    }
  }

  @HostListener('blur')
  onBlur() {
    if (this.tipo === 'data') {
      this.formatarData();
    }
  }

  private formatarMoeda() {
    const input = this.el.nativeElement;
    let valor = input.value.replace(/\D/g, '');
    
    // Converte para número com duas casas decimais
    const valorNumerico = parseFloat(valor) / 100;
    
    if (!isNaN(valorNumerico)) {
      // Formata como moeda brasileira
      const valorFormatado = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(valorNumerico);
      
      // Atualiza o valor no controle do formulário
      this.ngControl.control?.setValue(valorNumerico, { emitEvent: false });
      input.value = valorFormatado;
    }
  }

  private formatarData() {
    const input = this.el.nativeElement;
    const valor = input.value.replace(/\D/g, '');
    
    if (valor.length === 8) {
      const dia = valor.slice(0, 2);
      const mes = valor.slice(2, 4);
      const ano = valor.slice(4, 8);
      
      const dataFormatada = `${dia}/${mes}/${ano}`;
      
      // Validação básica da data
      const dataValida = this.validarData(dia, mes, ano);
      
      if (dataValida) {
        input.value = dataFormatada;
        // Converte para objeto Date para o controle do formulário
        const data = new Date(`${ano}-${mes}-${dia}`);
        this.ngControl.control?.setValue(data, { emitEvent: false });
      } else {
        // Limpa o campo se a data for inválida
        input.value = '';
        this.ngControl.control?.setValue(null, { emitEvent: false });
      }
    }
  }

  private validarData(dia: string, mes: string, ano: string): boolean {
    const diaNum = parseInt(dia, 10);
    const mesNum = parseInt(mes, 10);
    const anoNum = parseInt(ano, 10);

    // Verificações básicas
    if (mesNum < 1 || mesNum > 12) return false;
    if (diaNum < 1 || diaNum > 31) return false;

    // Verificação de dias por mês
    const diasPorMes = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (diaNum > diasPorMes[mesNum - 1]) return false;

    // Verificação de ano bissexto
    if (mesNum === 2) {
      const ehBissexto = (anoNum % 4 === 0 && anoNum % 100 !== 0) || (anoNum % 400 === 0);
      if (!ehBissexto && diaNum > 28) return false;
    }

    return true;
  }
}