import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';

@Directive({
  selector: '[formatacaoBrasileira]',
  standalone: true
})
export class FormatacaoBrasileiraDirective implements OnInit {
  @Input('formatacaoBrasileira') dataEntrada: Date | string | null = null;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    if (this.dataEntrada) {
      const dataFormatada = this.formatarDataBrasileira(this.dataEntrada);
      this.el.nativeElement.textContent = dataFormatada;
    }
  }

  private formatarDataBrasileira(data: Date | string | null): string {
    if (!data) return '';

    try {
      const objetoData = data instanceof Date ? data : new Date(data);
      
      if (isNaN(objetoData.getTime())) return '';

      return formatDate(objetoData, 'dd/MM/yyyy', 'pt-BR');
    } catch (erro) {
      console.error('Erro ao formatar data:', erro);
      return '';
    }
  }
}