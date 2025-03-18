import { Component, Input } from '@angular/core';
import { TaskPriorityComponent } from "../task-priority/task-priority.component";
import { DepartmentComponent } from "../department/department.component";
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-task-card',
  imports: [TaskPriorityComponent, DepartmentComponent],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css'
})
export class TaskCardComponent {
  @Input() title!: string;
  @Input() description!: string;

  constructor(private apiService: ApiService) {}

  redirectToDetails(ID: number) {
    window.location.href = `/tasks/${ID}`;
  }
}
