import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ValidateTaskFormService } from '../../services/validate-task-form.service';
import { ApiService } from '../../services/api.service';
import { Priority } from '../../interfaces/priority.model';
import { Status } from '../../interfaces/status.model';
import { Department } from '../../interfaces/department.model';
import { Employee } from '../../interfaces/employee.model';

@Component({
  selector: 'app-task-form-page',
  imports: [NgSelectModule, FormsModule, CommonModule],
  templateUrl: './task-form-page.component.html',
  styleUrl: './task-form-page.component.css',
})
export class TaskFormPageComponent implements OnInit {
  priorities!: Priority[];
  statuses!: Status[];
  departments!: Department[];
  employees!: Employee[];

  taskTitle: string = '';
  taskDescription: string = '';
  selectedPriorityID: number = 2;
  selectedStatusID: number = 1;
  selectedDepartmentID: number = 1;
  selectedEmployeeID: number | null = null;

  constructor(
    private apiService: ApiService,
    public validationService: ValidateTaskFormService
  ) {}

  ngOnInit(): void {
    this.apiService.get<Priority[]>('priorities').subscribe((data) => {
      this.priorities = data;
    });

    this.apiService.get<Status[]>('statuses').subscribe((data) => {
      this.statuses = data;
    });

    this.apiService.get<Department[]>('departments').subscribe((data) => {
      this.departments = data;
    });

    this.apiService.get<Employee[]>('employees').subscribe((data) => {
      this.employees = data;
    });
  }
}
