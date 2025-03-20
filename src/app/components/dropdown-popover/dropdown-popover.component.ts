import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CheckboxComponent } from "../checkbox/checkbox.component";
import { DropdownService } from '../../services/dropdown.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dropdown-popover',
  imports: [CommonModule, CheckboxComponent],
  templateUrl: './dropdown-popover.component.html',
  styleUrl: './dropdown-popover.component.css',
})
export class DropdownPopoverComponent implements OnInit {
  isVisible = false;
  activeDropdownType: string | null = null;
  items: string[] = [];
  selectedItems: string[] = [];
  isLoading = false;
  private subscription = new Subscription();

  constructor(private dropdownService: DropdownService) {}

  ngOnInit() {
    // Subscribe to active dropdown changes
    this.subscription.add(
      this.dropdownService.activeDropdown$.subscribe((active) => {
        this.isVisible = active !== null;
        this.activeDropdownType = active;
      })
    );

    // Subscribe to dropdown data changes
    this.subscription.add(
      this.dropdownService.dropdownData$.subscribe((data) => {
        if (data) {
          this.items = data.items;
          this.selectedItems = [...data.selectedItems];
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  toggleItem(item: string) {
    const index = this.selectedItems.indexOf(item);
    if (index > -1) {
      this.selectedItems.splice(index, 1);
    } else {
      this.selectedItems.push(item);
    }
  }

  isItemSelected(item: string): boolean {
    return this.selectedItems.includes(item);
  }

  apply() {
    if (this.activeDropdownType) {
      this.dropdownService.updateSelection(
        this.activeDropdownType,
        this.selectedItems
      );
      this.dropdownService.toggleDropdown(null); // Close the dropdown
    }
  }
}
