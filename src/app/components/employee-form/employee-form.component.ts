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
})
export class EmployeeFormComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription(); // Subscription to modal visibility changes

  isVisible: boolean = false; // Tracks if the form modal is visible

  // Dictionary mapping department names to IDs
  departmentsIDsDictionary: Record<string, number> = {
    'ადმინისტრაციის დეპარტამენტი': 1,
    'ადამიანური რესურსების დეპარტამენტი': 2,
    'ფინანსების დეპარტამენტი': 3,
    'გაყიდვები და მარკეტინგის დეპარტამენტი': 4,
    'ლოჯოსტიკის დეპარტამენტი': 5,
    'ტექნოლოგიების დეპარტამენტი': 6,
    'მედიის დეპარტამენტი': 7,
  };

  // Form input fields
  firstName: string = '';
  lastName: string = '';
  fileContent: string | null = null;
  department: string = '';
  departmentID: number | undefined = this.getDepartmentID(this.department);
  originalFileName: string = ''; // Store original file name for the avatar

  constructor(
    public modalService: EmployeeModalService, // Modal service to control visibility
    public validationService: ValidateEmployeeFormService, // Validation service for form fields
    private apiService: ApiService // API service to submit employee data
  ) {}

  // Method to get department ID from the department name
  getDepartmentID(departmentName: string): number | undefined {
    // Direct lookup for department name
    if (this.departmentsIDsDictionary[departmentName] !== undefined) {
      return this.departmentsIDsDictionary[departmentName];
    }

    // Trim spaces and check again
    const trimmed = departmentName.trim();
    if (this.departmentsIDsDictionary[trimmed] !== undefined) {
      return this.departmentsIDsDictionary[trimmed];
    }

    // Case-insensitive search for department
    const key = Object.keys(this.departmentsIDsDictionary).find(
      (k) => k.toLowerCase() === departmentName.toLowerCase()
    );

    return key ? this.departmentsIDsDictionary[key] : undefined; // Return department ID or undefined
  }

  // Handle file selection and validate avatar
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return; // Check if a file is selected

    const file = input.files[0];
    this.originalFileName = file.name; // Store the original file name

    const reader = new FileReader();

    reader.onload = () => {
      const fileContent = reader.result as string; // Get file content as Base64

      // Validate avatar size and format
      if (this.validationService.validateAvatar(fileContent)) {
        this.fileContent = fileContent; // Set valid avatar content
      } else {
        // Handle invalid file (either size or format issue)
        console.error(
          'Invalid avatar: File exceeds 600KB or has an invalid format'
        );
        alert(
          'Please select a valid image file (jpeg, jpg, png, gif, webp) under 600KB.'
        );
        input.value = ''; // Reset file input
      }
    };

    reader.readAsDataURL(file); // Convert file to Base64 format
  }

  // Clear selected file
  clearFileContent(event: Event): void {
    event.stopPropagation();
    this.fileContent = null; // Clear file content
  }

  // Check if all data is valid before submission
  checkDataValidation(): boolean {
    return (
      this.validationService.validateFirstName(this.firstName) && // Validate first name
      this.validationService.validateLastName(this.lastName) && // Validate last name
      this.validationService.validateAvatar(this.fileContent) && // Validate avatar
      this.validationService.validateDepartment(this.department) // Validate department
    );
  }

  // Submit form data to the API
  submitFormData() {
    const formData = new FormData();
    formData.append('name', this.firstName); // Append first name to form data
    formData.append('surname', this.lastName); // Append last name to form data
    formData.append(
      'department_id',
      this.departmentID !== undefined ? this.departmentID.toString() : ''
    );

    // If file content is available, process the avatar image
    if (this.fileContent && this.originalFileName) {
      const mimeType = this.getMimeType(this.fileContent); // Get MIME type from Base64 string
      const extension = mimeType.split('/')[1]; // Extract file extension
      const byteCharacters = atob(this.fileContent.split(',')[1]); // Decode Base64 string
      const byteNumbers = new Array(byteCharacters.length);

      // Convert Base64 string to byte array
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType }); // Create Blob from byte array

      // Ensure correct file extension
      const originalExtension = this.originalFileName.split('.').pop();
      const fileName = originalExtension
        ? this.originalFileName
        : `avatar.${extension}`;

      formData.append('avatar', blob, fileName); // Append avatar to form data
    }

    // Send POST request to API
    this.apiService.post<Employee>('employees', formData).subscribe({
      next: (response) => {
        console.log('Employee data submitted successfully!', response);
        alert('Employee created successfully!');
        this.resetForm(); // Reset the form after successful submission
      },
      error: (error) => {
        console.error('Error submitting data:', error);
        alert('Error creating employee. Please try again later.');
      },
    });
  }

  // Reset the form fields and close the modal
  resetForm() {
    this.firstName = '';
    this.lastName = '';
    this.department = '';
    this.fileContent = null;
    this.closeModal(); // Close the modal
  }

  ngOnInit(): void {
    // Subscribe to modal visibility changes to show or hide the form
    this.subscription = this.modalService.isVisible$.subscribe((isVisible) => {
      this.isVisible = isVisible;
    });
  }

  ngOnDestroy(): void {
    // Clean up subscription when component is destroyed to prevent memory leaks
    this.subscription.unsubscribe();
  }

  // Close the modal through the modal service
  closeModal(): void {
    this.modalService.closeModal();
  }

  // Helper function to extract MIME type from Base64 string
  private getMimeType(base64: string): string {
    const match = base64.match(/^data:(.*?);base64,/);
    return match ? match[1] : 'application/octet-stream'; // Return MIME type
  }
}
