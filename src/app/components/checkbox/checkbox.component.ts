import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Component,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.css',
})
export class CheckboxComponent {
  @Input() label!: string;
  @Output() checkedChange = new EventEmitter<boolean>();
  @ViewChild('checkbox') checkboxRef!: ElementRef<HTMLInputElement>;

  isChecked = false;

  toggleCheckbox() {
    this.isChecked = !this.isChecked;
    this.checkedChange.emit(this.isChecked);
  }
}
