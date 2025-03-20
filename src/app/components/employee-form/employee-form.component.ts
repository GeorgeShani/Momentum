import { Component, OnInit, OnDestroy } from '@angular/core';
import { CheckIconComponent } from '../check-icon/check-icon.component';
import { EmployeeModalService } from '../../services/employee-modal.service';
import { ValidateEmployeeFormService } from '../../services/validate-employee-form.service';
import { ApiService } from '../../services/api.service';
import { Employee } from '../../interfaces/employee.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

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
  departmentID: number | undefined = this.getDepartmentID(this.department);

  originalFileName: string = '';

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
    this.originalFileName = file.name;

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
    event.stopPropagation();
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

  submitFormData() {
    const formData = new FormData();
    formData.append('name', this.firstName);
    formData.append('surname', this.lastName);
    formData.append(
      'department_id',
      this.departmentID !== undefined ? this.departmentID.toString() : ''
    );

    if (this.fileContent && this.originalFileName) {
      const mimeType = this.getMimeType(this.fileContent);
      const extension = mimeType.split('/')[1]; // Extract file extension
      const byteCharacters = atob(this.fileContent.split(',')[1]); // Decode Base64
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType }); // Create Blob

      // Ensure the correct file extension is used
      const originalExtension = this.originalFileName.split('.').pop();
      const fileName = originalExtension
        ? this.originalFileName
        : `avatar.${extension}`;

      formData.append('avatar', blob, fileName); // Append with original name
    }

    this.apiService.post<Employee>('employees', formData).subscribe({
      next: (response) => {
        console.log('Employee data submitted successfully!', response);
        alert('თანამშრომელი წარმატებით შეიქმნა!');
        this.resetForm();
      },
      error: (error) => {
        console.error('Error submitting data:', error);
        alert('თანამშრომელი ვერ შეიქმნა. გთხოვთ, მოგვიანებით სცადოთ');
      },
    });
  }

  resetForm() {
    this.firstName = '';
    this.lastName = '';
    this.department = '';
    this.fileContent = null;
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

  private getMimeType(base64: string): string {
    const match = base64.match(/^data:(.*?);base64,/);
    return match ? match[1] : 'application/octet-stream';
  }
}
