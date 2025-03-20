import { Component, Input } from '@angular/core';
import { TaskPriorityComponent } from '../task-priority/task-priority.component';
import { DepartmentComponent } from '../department/department.component';
import { CommonModule } from '@angular/common';
import { Task } from '../../interfaces/task.model';

@Component({
  selector: 'app-task-card',
  imports: [TaskPriorityComponent, DepartmentComponent, CommonModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css',
})
export class TaskCardComponent {
  @Input() task!: Task;

  statusColors: Record<string, string> = {
    დასაწყები: '#F7BC30',
    პროგრესში: '#FB5607',
    'მზად ტესტირებისთვის': '#FF006E',
    დასრულებული: '#3A86FF',
  };

  formatDate(dateString: string): string {
    if (!dateString) return ""

    const date: Date = new Date(dateString)
    const months: string[] = [
      "იან", "თებ", "მარ", "აპრ",
      "მაი", "ივნ", "ივლ", "აგვ",
      "სექ", "ოქტ", "ნოე", "დეკ"
    ]

    return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`
  }

  redirectToDetails(ID: number) {
    window.location.href = `/tasks/${ID}`;
  }
}
