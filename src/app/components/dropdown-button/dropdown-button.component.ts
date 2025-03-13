import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dropdown-button',
  imports: [],
  templateUrl: './dropdown-button.component.html',
  styleUrl: './dropdown-button.component.css'
})
export class DropdownButtonComponent {
  @Input() dropdownName!: string;
}
