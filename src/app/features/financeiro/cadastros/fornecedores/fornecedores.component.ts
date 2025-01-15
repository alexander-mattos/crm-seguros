import { Component } from '@angular/core';
import { HeaderComponent } from '../../../../components/header/header.component';
import { SidebarComponent } from '../../../../components/sidebar/sidebar.component';
import { FooterComponent } from '../../../../components/footer/footer.component';
import { NavbarComponent } from '../../components/navbar.component';

@Component({
  selector: 'app-fornecedores',
  imports: [HeaderComponent, SidebarComponent, FooterComponent, NavbarComponent],
  templateUrl: './fornecedores.component.html',
  styleUrl: './fornecedores.component.css'
})
export class FornecedoresComponent {

}
