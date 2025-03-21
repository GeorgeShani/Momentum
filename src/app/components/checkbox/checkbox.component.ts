import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  imports: [CommonModule, FormsModule],
  templateUrl: './checkbox.component.html',
})
export class CheckboxComponent {
  @Input() label!: string; // Input property to accept the checkbox label from the parent component
  @Input() isChecked = false; // Input property to set whether the checkbox is initially checked
  // Output event to notify the parent component when the checkbox state changes
  @Output() change = new EventEmitter<boolean>();

  // Method to toggle the checkbox state and emit the new state to the parent component
  toggleCheckbox(event: Event) {
    event.stopPropagation(); // Prevent the event from propagating further
    this.isChecked = !this.isChecked; // Toggle the checkbox state
    this.change.emit(this.isChecked); // Emit the updated state to the parent component
  }
}
