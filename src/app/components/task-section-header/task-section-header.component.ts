import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-task-section-header',
  imports: [CommonModule],
  templateUrl: './task-section-header.component.html',
  styleUrl: './task-section-header.component.css',
})
export class TaskSectionHeaderComponent {
  @Input() taskStatus!: string;
  @Input() backgroundColor!: string;
}
