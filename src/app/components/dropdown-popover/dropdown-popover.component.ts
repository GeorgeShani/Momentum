import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CheckboxComponent } from "../checkbox/checkbox.component";

@Component({
  selector: 'app-dropdown-popover',
  imports: [CommonModule, CheckboxComponent],
  templateUrl: './dropdown-popover.component.html',
  styleUrl: './dropdown-popover.component.css',
})
export class DropdownPopoverComponent {
  
}
