import { Component, Input } from '@angular/core';
import { DropdownService } from '../../services/dropdown.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dropdown-button',
  imports: [CommonModule],
  templateUrl: './dropdown-button.component.html',
})
export class DropdownButtonComponent {
  // Input property to pass the name of the dropdown this button controls
  @Input() dropdownName!: string;

  // Holds the subscription to manage active dropdown changes
  private subscription: Subscription = new Subscription();
  public isActive: boolean = false; // Tracks if this dropdown is active (open)

  constructor(private dropdownService: DropdownService) {}

  // ngOnInit is called once the component is initialized
  ngOnInit() {
    // Subscribe to active dropdown changes from the dropdownService
    // This will ensure the button toggles the `isActive` state correctly when the active dropdown changes
    this.subscription.add(
      this.dropdownService.activeDropdown$.subscribe((active) => {
        this.isActive = active === this.dropdownName; // Set `isActive` if this button's dropdown is the active one
      })
    );
  }

  // ngOnDestroy is called when the component is destroyed
  ngOnDestroy() {
    // Unsubscribe from the active dropdown changes to avoid memory leaks
    this.subscription.unsubscribe();
  }

  // Toggles the visibility of the dropdown when the button is clicked
  toggleDropdown() {
    // Call the service to toggle the dropdown's active state
    this.dropdownService.toggleDropdown(this.dropdownName);
  }
}
