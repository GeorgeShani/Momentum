import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { DropdownService } from '../../services/dropdown.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dropdown-popover',
  imports: [CommonModule, CheckboxComponent],
  templateUrl: './dropdown-popover.component.html',
})
export class DropdownPopoverComponent implements OnInit {
  isVisible: boolean = false; // Tracks if the dropdown popover is visible
  isLoading: boolean = false; // Indicates if data is being loaded for the dropdown
  
  items: string[] = []; // Array to hold the items to be displayed in the dropdown
  selectedItems: string[] = []; // Array to hold the currently selected items
  activeDropdownType: string | null = null; // Stores the type of the active dropdown (if any)

  // Holds the subscriptions for observing active dropdown changes and dropdown data
  private subscription: Subscription = new Subscription();

  constructor(private dropdownService: DropdownService) {}

  // ngOnInit is called once the component is initialized
  ngOnInit() {
    // Subscribe to active dropdown changes from the dropdownService
    // This updates the visibility and type of the active dropdown whenever it changes
    this.subscription.add(
      this.dropdownService.activeDropdown$.subscribe((active) => {
        this.isVisible = active !== null; // Set the visibility based on whether there is an active dropdown
        this.activeDropdownType = active; // Update the active dropdown type
      })
    );

    // Subscribe to dropdown data changes from the dropdownService
    // This updates the items and selectedItems whenever the dropdown data changes
    this.subscription.add(
      this.dropdownService.dropdownData$.subscribe((data) => {
        if (data) {
          this.items = data.items; // Set the items list for the dropdown
          this.selectedItems = [...data.selectedItems]; // Set the currently selected items
        }
      })
    );
  }

  // ngOnDestroy is called when the component is destroyed
  ngOnDestroy() {
    // Unsubscribe from all subscriptions to prevent memory leaks
    this.subscription.unsubscribe();
  }

  // Method to toggle an item between selected and deselected
  toggleItem(item: string) {
    const index = this.selectedItems.indexOf(item);
    if (index > -1) {
      this.selectedItems.splice(index, 1); // Deselect the item if it's already selected
    } else {
      this.selectedItems.push(item); // Select the item if it's not already selected
    }
  }

  // Method to check if an item is selected
  isItemSelected(item: string): boolean {
    return this.selectedItems.includes(item); // Returns true if the item is selected, otherwise false
  }

  // Method to apply the selected items and update the dropdown selection
  apply() {
    if (this.activeDropdownType) {
      // Call the dropdownService to update the selection for the active dropdown type
      this.dropdownService.updateSelection(
        this.activeDropdownType,
        this.selectedItems
      );
      // Close the dropdown by passing null to toggleDropdown
      this.dropdownService.toggleDropdown(null);
    }
  }
}
