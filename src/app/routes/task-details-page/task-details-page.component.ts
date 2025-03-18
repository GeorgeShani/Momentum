import { Component, OnInit } from '@angular/core';
import { TaskPriorityComponent } from '../../components/task-priority/task-priority.component';
import { DepartmentComponent } from '../../components/department/department.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { Status } from '../../interfaces/status.model';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LeftIconComponent } from "../../components/left-icon/left-icon.component";

@Component({
  selector: 'app-task-details-page',
  imports: [
    TaskPriorityComponent,
    DepartmentComponent,
    NgSelectModule,
    FormsModule,
    LeftIconComponent
],
  templateUrl: './task-details-page.component.html',
  styleUrl: './task-details-page.component.css',
})
export class TaskDetailsPageComponent implements OnInit {
  statuses!: Status[];
  selectedStatusID: number = 2;

  taskID!: number;
  georgianDays: string[] = ['ორშ', 'სამ', 'ოთხ', 'ხუთ', 'პარ', 'შაბ', 'კვ'];

  comment: string = "";

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.taskID = idParam ? parseInt(idParam, 10) : NaN;

    this.apiService.get<Status[]>('statuses').subscribe((data) => {
      this.statuses = data;
    });
  }
}
