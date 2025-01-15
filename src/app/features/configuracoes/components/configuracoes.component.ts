import { Component } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header.component';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { FooterComponent } from '../../../components/footer/footer.component';

@Component({
  selector: 'app-configuracoes',
  imports: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ],
  templateUrl: './configuracoes.component.html',
  styleUrl: './configuracoes.component.css'
})
export class ConfiguracoesComponent {

}
