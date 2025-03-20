import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.css',
})
export class CheckboxComponent {
  @Input() label!: string;
  @Input() isChecked = false;
  @Output() change = new EventEmitter<boolean>();

  toggleCheckbox() {
    this.isChecked = !this.isChecked;
    this.change.emit(this.isChecked);
  }
}
