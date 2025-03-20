import { Component, Input } from '@angular/core';
import { DropdownService } from '../../services/dropdown.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dropdown-button',
  imports: [CommonModule],
  templateUrl: './dropdown-button.component.html',
  styleUrl: './dropdown-button.component.css',
})
export class DropdownButtonComponent {
  @Input() dropdownName!: string;
  isActive = false;
  private subscription = new Subscription();

  constructor(private dropdownService: DropdownService) {}

  ngOnInit() {
    // Subscribe to active dropdown changes
    this.subscription.add(
      this.dropdownService.activeDropdown$.subscribe((active) => {
        this.isActive = active === this.dropdownName;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  toggleDropdown() {
    this.dropdownService.toggleDropdown(this.dropdownName);
  }
}
