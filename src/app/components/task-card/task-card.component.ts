import { Component } from '@angular/core';
import { TaskPriorityComponent } from "../task-priority/task-priority.component";
import { DepartmentComponent } from "../department/department.component";

@Component({
  selector: 'app-task-card',
  imports: [TaskPriorityComponent, DepartmentComponent],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css'
})
export class TaskCardComponent {
  redirectToDetails(ID: number) {
    window.location.href = `/tasks/${ID}`;
  }
}
