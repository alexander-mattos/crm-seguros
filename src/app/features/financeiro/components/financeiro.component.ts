import { Component } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header.component';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { NavbarComponent } from './navbar.component';

@Component({
  selector: 'app-financeiro',
  imports: [HeaderComponent, SidebarComponent, FooterComponent, NavbarComponent],
  templateUrl: './financeiro.component.html',
  styleUrl: './financeiro.component.css'
})
export class FinanceiroComponent {

}
