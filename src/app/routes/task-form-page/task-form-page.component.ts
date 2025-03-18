import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule, NgSelectComponent } from '@ng-select/ng-select';
import { DatePickerComponent } from '../../components/date-picker/date-picker.component';
import { ValidateTaskFormService } from '../../services/validate-task-form.service';
import { ApiService } from '../../services/api.service';
import { Priority } from '../../interfaces/priority.model';
import { Status } from '../../interfaces/status.model';
import { Department } from '../../interfaces/department.model';
import { Employee } from '../../interfaces/employee.model';
import { TaskFormData } from '../../interfaces/task-form-data.model';
import { EmployeeModalService } from '../../services/employee-modal.service';

@Component({
  selector: 'app-task-form-page',
  imports: [NgSelectModule, FormsModule, CommonModule, DatePickerComponent],
  templateUrl: './task-form-page.component.html',
  styleUrl: './task-form-page.component.css',
})
export class TaskFormPageComponent implements OnInit {
  @ViewChild('employeeSelect') employeeSelect!: NgSelectComponent;

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
  selectedDeadlineDate!: Date;
  selectedDeadlineDateString: string = this.selectedDeadlineDate
    ? `${this.selectedDeadlineDate.getFullYear()}-${
        this.selectedDeadlineDate.getMonth() + 1
      }-${this.selectedDeadlineDate.getDate()}`
    : '';

  taskFormData: TaskFormData = {
    name: this.taskTitle,
    description: this.taskDescription,
    due_date: this.selectedDeadlineDateString,
    status_id: this.selectedStatusID,
    employee_id: this.selectedEmployeeID,
    priority_id: this.selectedPriorityID,
  };

  constructor(
    private apiService: ApiService,
    public validationService: ValidateTaskFormService,
    private modalService: EmployeeModalService
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

  openEmployeeModal(): void {
    this.employeeSelect.close();
    this.modalService.openModal();
  }

  submitTaskForm(formData: any): void {
    this.apiService.post('tasks', formData).subscribe({
      next: (response) => {
        console.log('Task created successfully', response);
      },
      error: (error) => {
        console.error('Error creating task', error);
      },
    });
  }
}
