import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-filter-option',
  imports: [],
  templateUrl: './filter-option.component.html',
  styleUrl: './filter-option.component.css'
})
export class FilterOptionComponent {
  @Input() label!: string;
}
