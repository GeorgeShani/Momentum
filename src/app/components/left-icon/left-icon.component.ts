import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-left-icon',
  imports: [],
  templateUrl: './left-icon.component.html',
})
export class LeftIconComponent {
  @Input() defaultColor!: string;
  @Input() hoverColor!: string;
}
