import { Component } from '@angular/core';
import { HeaderComponent } from '../../../../../components/header/header.component';
import { SidebarComponent } from '../../../../../components/sidebar/sidebar.component';
import { FooterComponent } from '../../../../../components/footer/footer.component';
import { NavbarComponent } from '../../../components/navbar.component';

@Component({
  selector: 'app-incluirlancamentos',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, FooterComponent, NavbarComponent],
  templateUrl: './incluirlancamentos.component.html',
  styleUrl: './incluirlancamentos.component.css'
})
export class IncluirlancamentosComponent {

}
