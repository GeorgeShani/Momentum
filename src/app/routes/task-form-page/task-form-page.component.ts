import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ApiService } from '../../services/api.service';
import { Priority } from '../../interfaces/priority.model';
import { Status } from '../../interfaces/status.model';
import { Department } from '../../interfaces/department.model';
import { Employee } from '../../interfaces/employee.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-form-page',
  imports: [NgSelectModule, FormsModule, CommonModule],
  templateUrl: './task-form-page.component.html',
  styleUrl: './task-form-page.component.css',
})
export class TaskFormPageComponent {
  priorities!: Priority[];
  statuses!: Status[];
  departments!: Department[];
  employees!: Employee[];
  
  constructor(private apiService: ApiService) {
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

  selectedPriorityID: number = 2;
  selectedStatusID: number = 1;
  selectedDepartmentID: number = 1;
  selectedEmployeeID: number = 1;
}
