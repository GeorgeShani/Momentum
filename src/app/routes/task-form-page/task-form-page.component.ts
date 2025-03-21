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
  // ViewChild to access the employee select component
  @ViewChild('employeeSelect') employeeSelect!: NgSelectComponent;

  // Arrays to store data for priorities, statuses, departments, and employees
  priorities!: Priority[];
  statuses!: Status[];
  departments!: Department[];
  employees!: Employee[];

  // Form input variables
  taskTitle: string = '';
  taskDescription: string = '';
  selectedPriorityID: number = 2;
  selectedStatusID: number = 1;
  selectedDepartmentID: number = 1;
  selectedEmployeeID: number | null = null;
  selectedDeadlineDate: Date = new Date(new Date().setDate(new Date().getDate() + 1)); // Default deadline set to the next day
  selectedDeadlineDateString: string = this.selectedDeadlineDate
    ? `${this.selectedDeadlineDate.getFullYear()}-${this.selectedDeadlineDate.getMonth() + 1}-${this.selectedDeadlineDate.getDate()}`
    : 'Invalid Date'; // Formatted string for the selected deadline date

  constructor(
    private apiService: ApiService, // Injecting the API service
    public validationService: ValidateTaskFormService, // Injecting the form validation service
    private modalService: EmployeeModalService // Injecting the modal service for employee selection
  ) {}

  // Fetch the list of priorities, statuses, departments, and employees on component initialization
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

  // Open the employee selection modal
  openEmployeeModal(): void {
    this.employeeSelect.close(); // Close the select dropdown
    this.modalService.openModal(); // Open the modal to select an employee
  }

  // Validate all form data before submission
  checkDataValidation(): boolean {
    return (
      this.validationService.validateTitle(this.taskTitle) && // Validate title
      this.validationService.validateDescription(this.taskDescription) && // Validate description
      this.validationService.validatePriority(this.selectedPriorityID) && // Validate priority
      this.validationService.validateStatus(this.selectedStatusID) && // Validate status
      this.validationService.validateDepartment(this.selectedDepartmentID) && // Validate department
      this.validationService.validateResponsibleEmployee(this.selectedEmployeeID) && // Validate employee selection
      this.validationService.validateDeadline(this.selectedDeadlineDate) // Validate deadline
    );
  }

  // Submit the task form data to the API
  submitTaskForm(): void {
    const taskFormData: TaskFormData = {
      name: this.taskTitle,
      description: this.taskDescription,
      due_date: this.selectedDeadlineDateString,
      status_id: this.selectedStatusID,
      employee_id: this.selectedEmployeeID,
      priority_id: this.selectedPriorityID,
    };

    // Check if all required fields are filled
    if (
      !taskFormData.name ||
      !taskFormData.description ||
      !taskFormData.due_date ||
      !taskFormData.status_id ||
      !taskFormData.employee_id ||
      !taskFormData.priority_id
    ) {
      alert('გთხოვთ, შეავსოთ ყველა აუცილებელი ველი'); // Alert message if fields are missing
      return;
    }

    // Send POST request to create a new task
    this.apiService.post<Task>('tasks', taskFormData).subscribe({
      next: (response) => {
        alert('დავალება წარმატებით შეიქმნა!'); // Success message
        this.resetForm(); // Reset the form
      },
      error: (error) => {
        console.error('Error creating task', error);
        alert('დავალება ვერ შეიქმნა. გთხოვთ, მოგვიანებით სცადოთ'); // Error message
      },
    });
  }

  // Reset form fields to their default values
  resetForm(): void {
    this.taskTitle = '';
    this.taskDescription = '';
    this.selectedDeadlineDate = new Date(); // Reset to today's date
    this.selectedStatusID = 1; // Default status ID
    this.selectedEmployeeID = null; // Default employee ID (no employee selected)
    this.selectedPriorityID = 2; // Default priority ID
  }
}
