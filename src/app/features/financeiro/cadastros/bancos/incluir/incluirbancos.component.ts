import { Component } from '@angular/core';
import { HeaderComponent } from '../../../../../components/header/header.component';
import { SidebarComponent } from '../../../../../components/sidebar/sidebar.component';
import { FooterComponent } from '../../../../../components/footer/footer.component';
import { NavbarComponent } from '../../../components/navbar.component';

@Component({
  selector: 'app-incluir',
  imports: [HeaderComponent, SidebarComponent, FooterComponent, NavbarComponent],
  templateUrl: './incluirbancos.component.html',
  styleUrl: './incluirbancos.component.css'
})
export class IncluirbancosComponent {

}
