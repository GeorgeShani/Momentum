import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-task-priority',
  imports: [CommonModule],
  templateUrl: './task-priority.component.html',
  styleUrl: './task-priority.component.css',
})
export class TaskPriorityComponent {
  @Input() priorityName!: string;
  @Input() priorityIcon!: string;

  priorityColors: Record<string, string> = {
    დაბალი: '#08A508',
    საშუალო: '#FFBE0B',
    მაღალი: '#FA4D4D',
  };
}
