
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="navbar navbar-expand-lg navbar-light rounded mb-3" style="background-color: rgba(40, 167, 69, 0.3);">
      <div class="navbar-brand"><i class="fas fa-sack-dollar"></i></div>
      <button class="navbar-toggler" type="button" (click)="isMenuCollapsed = !isMenuCollapsed">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" [ngClass]="{'show': !isMenuCollapsed}">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item" id="liGestaoInicio">
            <a class="nav-link text-dark" routerLink="/financeiro">Início</a>
          </li>
          <li class="nav-item" id="liGestaoLancamentos">
            <a class="nav-link text-dark" routerLink="/financeiro/lancamentos">Lançamentos</a>
          </li>
          <li class="nav-item dropdown" id="liGestaoCadastros">
            <a class="nav-link text-dark dropdown-toggle" href="javascript:void(0)" 
               (click)="toggleDropdown('cadastros')" 
               [attr.aria-expanded]="dropdownStates.cadastros">
              Cadastros
            </a>
            <div class="dropdown-menu" [ngClass]="{'show': dropdownStates.cadastros}">
              <a class="dropdown-item" routerLink="/financeiro/cadastros/bancos">Bancos</a>
              <a class="dropdown-item" routerLink="/financeiro/cadastros/contacorrente">Contas</a>
              <a class="dropdown-item" routerLink="/financeiro/cadastros/centrodecustos">Centros de Custo</a>
              <a class="dropdown-item" routerLink="/financeiro/cadastros/planodecontas">Planos de Conta</a>
              <a class="dropdown-item" routerLink="/financeiro/cadastros/fornecedores">Fornecedores</a>
            </div>
          </li>
          <li class="nav-item dropdown" id="liGestaoRelatorios">
            <a class="nav-link text-dark dropdown-toggle" href="javascript:void(0)"
               (click)="toggleDropdown('relatorios')"
               [attr.aria-expanded]="dropdownStates.relatorios">
              Relatórios
            </a>
            <div class="dropdown-menu" [ngClass]="{'show': dropdownStates.relatorios}">
              <a class="dropdown-item" routerLink="/financeiro/contas">Contas</a>
              <a class="dropdown-item" routerLink="/financeiro/fluxodecaixa">Fluxo de Caixa</a>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  `,
  styles: [`
    .dropdown-menu.show {
      display: block;
    }
  `]
})
export class NavbarComponent implements OnInit {
  isMenuCollapsed = true;
  dropdownStates = {
    cadastros: false,
    relatorios: false
  };

  constructor() {}

  ngOnInit(): void {}

  toggleDropdown(menu: 'cadastros' | 'relatorios'): void {

    Object.keys(this.dropdownStates).forEach(key => {
      if (key !== menu) {
        this.dropdownStates[key as keyof typeof this.dropdownStates] = false;
      }
    });
    
    this.dropdownStates[menu] = !this.dropdownStates[menu];
  }
}