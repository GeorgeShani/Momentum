import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  imports: [CommonModule, FormsModule],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.css',
})
export class CheckboxComponent {
  @Input() label!: string;
  @ViewChild('checkbox') checkboxRef!: ElementRef<HTMLInputElement>;

  isChecked = false;

  getCheckboxValue() {
    return this.checkboxRef.nativeElement.checked;
  }
}
