import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../../components/header/header.component';
import { SidebarComponent } from '../../../../components/sidebar/sidebar.component';
import { FooterComponent } from '../../../../components/footer/footer.component';

@Component({
  selector: 'app-incluirseguradora',
  imports: [
    CommonModule,
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ],
  templateUrl: './incluirseguradora.component.html',
  styleUrl: './incluirseguradora.component.css'
})
export class IncluirseguradoraComponent {

}
