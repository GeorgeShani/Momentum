import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filter-option',
  templateUrl: './filter-option.component.html',
})
export class FilterOptionComponent {
  @Input() label!: string; // Input property for the label text
  @Output() remove = new EventEmitter<void>(); // Event emitter to notify removal

  // Method to handle the remove action
  onRemove(event: Event): void {
    event.stopPropagation(); // Prevent event from bubbling up
    this.remove.emit(); // Emit the remove event
  }
}
