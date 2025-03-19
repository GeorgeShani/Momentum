import { Component, OnInit, OnDestroy } from '@angular/core';
import { CheckIconComponent } from '../check-icon/check-icon.component';
import { EmployeeModalService } from '../../services/employee-modal.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ValidateEmployeeFormService } from '../../services/validate-employee-form.service';
import { FormsModule } from '@angular/forms';
import { EmployeeFormData } from '../../interfaces/employee-form-data.model';
import { ApiService } from '../../services/api.service';
import { Employee } from '../../interfaces/employee.model';

@Component({
  selector: 'app-employee-form',
  imports: [CheckIconComponent, CommonModule, FormsModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css',
})
export class EmployeeFormComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();

  isVisible: boolean = false;

  departmentsIDsDictionary: Record<string, number> = {
    'ადმინისტრაციის დეპარტამენტი': 1,
    'ადამიანური რესურსების დეპარტამენტი': 2,
    'ფინანსების დეპარტამენტი': 3,
    'გაყიდვები და მარკეტინგის დეპარტამენტი': 4,
    'ლოჯოსტიკის დეპარტამენტი': 5,
    'ტექნოლოგიების დეპარტამენტი': 6,
    'მედიის დეპარტამენტი': 7,
  };

  firstName: string = '';
  lastName: string = '';
  fileContent: string | null = null;
  department: string = '';

  constructor(
    public modalService: EmployeeModalService,
    public validationService: ValidateEmployeeFormService,
    private apiService: ApiService
  ) {}

  getDepartmentID(departmentName: string): number | undefined {
    // Direct lookup
    if (this.departmentsIDsDictionary[departmentName] !== undefined) {
      return this.departmentsIDsDictionary[departmentName];
    }

    // Try trimming spaces
    const trimmed = departmentName.trim();
    if (this.departmentsIDsDictionary[trimmed] !== undefined) {
      return this.departmentsIDsDictionary[trimmed];
    }

    // Case-insensitive search
    const key = Object.keys(this.departmentsIDsDictionary).find(
      (k) => k.toLowerCase() === departmentName.toLowerCase()
    );

    return key ? this.departmentsIDsDictionary[key] : undefined;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const fileContent = reader.result as string; // Convert result to Base64

      // Validate the avatar before setting it
      if (this.validationService.validateAvatar(fileContent)) {
        this.fileContent = fileContent;
      } else {
        // Handle invalid file
        console.error(
          'Invalid avatar: File exceeds 600KB or has an invalid format'
        );
        alert(
          'Please select a valid image file (jpeg, jpg, png, gif, webp) under 600KB.'
        );
        // Reset the input
        input.value = '';
      }
    };

    reader.readAsDataURL(file); // Convert to Base64 format
  }

  clearFileContent(event: Event): void {
    event.preventDefault();
    this.fileContent = null;
  }

  checkDataValidation(): boolean {
    return (
      this.validationService.validateFirstName(this.firstName) &&
      this.validationService.validateLastName(this.lastName) &&
      this.validationService.validateAvatar(this.fileContent) &&
      this.validationService.validateDepartment(this.department)
    );
  }

  submitFormData(): void {
    const employeeFormData: EmployeeFormData = {
      name: this.firstName,
      surname: this.lastName,
      avatar: this.fileContent,
      department_id: this.getDepartmentID(this.department),
    };

    if (
      !employeeFormData.name ||
      !employeeFormData.surname ||
      !employeeFormData.avatar ||
      !employeeFormData.department_id
    ) {
      alert('გთხოვთ, შეავსოთ ყველა აუცილებელი ველი');
      return;
    }

    this.apiService.post<Employee>('employees', employeeFormData).subscribe({
      next: (response) => {
        console.log('Employee data submitted successfully!', response);
        alert('თანამშრომელი წარმატებით შეიქმნა!');
      },
      error: (error) => {
        console.error('Error submitting data:', error);
        alert('თანამშრომელი ვერ შეიქმნა. გთხოვთ, მოგვიანებით სცადოთ');
      },
    });

    this.firstName = '';
    this.lastName = '';
    this.fileContent = null;
    this.department = '';

    this.closeModal();
  }

  ngOnInit(): void {
    // Subscribe to modal visibility changes
    this.subscription = this.modalService.isVisible$.subscribe((isVisible) => {
      this.isVisible = isVisible;
    });
  }

  ngOnDestroy(): void {
    // Clean up subscription when component is destroyed
    this.subscription.unsubscribe();
  }

  closeModal(): void {
    this.modalService.closeModal();
  }
}
