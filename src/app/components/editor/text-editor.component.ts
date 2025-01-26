import { Component, ElementRef, forwardRef, HostListener, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-text-editor',
  template: `
    <div class="editor-container">
      <div class="toolbar">
        <button (click)="format('bold', $event)" title="Negrito"><i class="fas fa-bold"></i></button>
        <button (click)="format('italic', $event)" title="Itálico"><i class="fas fa-italic"></i></button>
        <button (click)="format('justifyLeft', $event)" title="Alinhar à esquerda"><i class="fas fa-align-left"></i></button>
        <button (click)="format('justifyCenter', $event)" title="Centralizar"><i class="fas fa-align-center"></i></button>
        <button (click)="format('justifyRight', $event)" title="Alinhar à direita"><i class="fas fa-align-right"></i></button>
        <button (click)="format('justifyFull', $event)" title="Justificar"><i class="fas fa-align-justify"></i></button>
        <button (click)="insertLink($event)" title="Inserir link"><i class="fas fa-link"></i></button>
        <button (click)="showHelp($event)" title="Ajuda"><i class="fas fa-question"></i></button>
      </div>
      <div #editor contenteditable="true" class="editor-content"></div>
    </div>
  `,
  styleUrls: ['./text-editor.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextEditorComponent),
      multi: true
    }
  ],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class TextEditorComponent implements ControlValueAccessor {
  @Input() formControlName!: string;
  private onChange = (value: any) => {};
  private onTouched = () => {};

  constructor(private el: ElementRef) {}

  writeValue(value: any): void {
    this.el.nativeElement.querySelector('.editor-content').innerHTML = value || '';
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  @HostListener('input', ['$event.target.innerHTML'])
  onInput(value: string): void {
    this.onChange(value);
  }

  @HostListener('blur')
  onBlur(): void {
    this.onTouched();
  }

  format(command: string, event: Event): void {
    event.preventDefault();
    document.execCommand(command, false, '');
  }

  insertLink(event: Event): void {
    event.preventDefault();
    const url = prompt('Enter the link here: ', 'http://');
    if (url !== null) {
      document.execCommand('createLink', false, url);
    }
  }

  showHelp(event: Event): void {
    event.preventDefault();
    alert('Help is not implemented.');
  }
}