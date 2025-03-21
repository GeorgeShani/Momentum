import { Component, Input } from '@angular/core';
import { TaskPriorityComponent } from '../task-priority/task-priority.component';
import { DepartmentComponent } from '../department/department.component';
import { CommonModule } from '@angular/common';
import { Task } from '../../interfaces/task.model';

@Component({
  selector: 'app-task-card',
  imports: [TaskPriorityComponent, DepartmentComponent, CommonModule],
  templateUrl: './task-card.component.html',
})
export class TaskCardComponent {
  @Input() task!: Task;  // Input property to receive the task data

  // Map of task statuses to their respective colors
  statusColors: Record<string, string> = {
    დასაწყები: '#F7BC30',  // Yellow for "To start"
    პროგრესში: '#FB5607',  // Orange for "In progress"
    'მზად ტესტირებისთვის': '#FF006E',  // Pink for "Ready for testing"
    დასრულებული: '#3A86FF',  // Blue for "Completed"
  };

  // Method to format date in the Georgian language
  formatDate(dateString: string): string {
    if (!dateString) return "";  // Return empty string if no date is provided

    const date: Date = new Date(dateString);  // Convert string to Date object
    const months: string[] = [  // Array of Georgian month abbreviations
      "იან", "თებ", "მარ", "აპრ",
      "მაი", "ივნ", "ივლ", "აგვ",
      "სექ", "ოქტ", "ნოე", "დეკ"
    ];

    // Return formatted date in the form "Day Month, Year"
    return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
  }

  // Method to redirect to task details page using task ID
  redirectToDetails(ID: number) {
    window.location.href = `/tasks/${ID}`;  // Navigate to the task details page
  }
}
