import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filter-option',
  imports: [],
  templateUrl: './filter-option.component.html',
  styleUrl: './filter-option.component.css',
})
export class FilterOptionComponent {
  @Input() label!: string;
  @Output() remove = new EventEmitter<void>();

  onRemove(event: Event): void {
    event.stopPropagation();
    this.remove.emit();
  }
}
