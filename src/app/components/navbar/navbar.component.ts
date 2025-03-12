import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  hourGlass: string = 'assets/images/Hourglass.svg';
  plusSign: string = 'assets/images/plus.svg';
}
