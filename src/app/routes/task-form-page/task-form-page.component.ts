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
import { Task } from '../../interfaces/task.model';

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
  selectedDeadlineDate: Date = new Date();
  selectedDeadlineDateString: string = this.selectedDeadlineDate
    ? `${this.selectedDeadlineDate.getFullYear()}-${
        this.selectedDeadlineDate.getMonth() + 1
      }-${this.selectedDeadlineDate.getDate()}`
    : 'Invalid Date';

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

  checkDataValidation(): boolean {
    return (
      this.validationService.validateTitle(this.taskTitle) &&
      this.validationService.validateDescription(this.taskDescription) &&
      this.validationService.validatePriority(this.selectedPriorityID) &&
      this.validationService.validateStatus(this.selectedStatusID) &&
      this.validationService.validateDepartment(this.selectedDepartmentID) &&
      this.validationService.validateResponsibleEmployee(
        this.selectedEmployeeID
      ) &&
      this.validationService.validateDeadline(this.selectedDeadlineDate)
    );
  }

  submitTaskForm(): void {
    const taskFormData: TaskFormData = {
      name: this.taskTitle,
      description: this.taskDescription,
      due_date: this.selectedDeadlineDateString,
      status_id: this.selectedStatusID,
      employee_id: this.selectedEmployeeID,
      priority_id: this.selectedPriorityID,
    };

    if (
      !taskFormData.name ||
      !taskFormData.description ||
      !taskFormData.due_date ||
      !taskFormData.status_id ||
      !taskFormData.employee_id ||
      !taskFormData.priority_id
    ) {
      console.log(taskFormData.name);
      console.log(taskFormData.description);
      console.log(taskFormData.due_date);
      console.log(taskFormData.status_id);
      console.log(taskFormData.employee_id);
      console.log(taskFormData.priority_id);
      alert('გთხოვთ, შეავსოთ ყველა აუცილებელი ველი');
      return;
    }

    this.apiService.post<Task>('tasks', taskFormData).subscribe({
      next: (response) => {
        console.log('Task created successfully', response);
        alert('დავალება წარმატებით შეიქმნა!');
      },
      error: (error) => {
        console.error('Error creating task', error);
        alert('დავალება ვერ შეიქმნა. გთხოვთ, მოგვიანებით სცადოთ');
      },
    });

    this.taskTitle = '';
    this.taskDescription = '';
    this.selectedDeadlineDate= new Date();
    this.selectedStatusID = 1;
    this.selectedEmployeeID = null;
    this.selectedPriorityID = 2;
  }
}
