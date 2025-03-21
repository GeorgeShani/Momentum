import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-check-icon',
  imports: [],
  templateUrl: './check-icon.component.html',
})
export class CheckIconComponent {
  @Input() strokeColor!: string;
}
