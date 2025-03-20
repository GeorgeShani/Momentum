import { Component, Input } from '@angular/core';
import { DropdownService } from '../../services/dropdown.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dropdown-button',
  imports: [CommonModule],
  templateUrl: './dropdown-button.component.html',
  styleUrl: './dropdown-button.component.css',
})
export class DropdownButtonComponent {
  @Input() dropdownName!: string;
  isActive = false;

  constructor(private dropdownService: DropdownService) {}

  ngOnInit() {
    this.dropdownService.activeDropdown$.subscribe((active) => {
      this.isActive = active === this.dropdownName;
    });
  }

  toggleDropdown() {
    this.dropdownService.toggleDropdown(this.dropdownName);
  }
}
