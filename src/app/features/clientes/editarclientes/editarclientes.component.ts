import { FooterComponent } from '@/app/components/footer/footer.component';
import { HeaderComponent } from '@/app/components/header/header.component';
import { SidebarComponent } from '@/app/components/sidebar/sidebar.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-editarclientes',
  standalone: true,
  imports: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ],
  templateUrl: './editarclientes.component.html',
  styleUrl: './editarclientes.component.css'
})
export class EditarclientesComponent {

}
