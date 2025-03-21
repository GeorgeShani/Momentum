import { Component } from '@angular/core';
import { EmployeeModalService } from '../../services/employee-modal.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  constructor(private modalService: EmployeeModalService) {} // Injecting the modal service

  // Method to open the employee modal
  openEmployeeModal(): void {
    this.modalService.openModal(); // Call the service to open the modal
  }

  // Method to redirect to the home page
  redirectToHome() {
    window.location.href = '/'; // Redirects the user to the home page
  }

  // Method to redirect to the task form page
  redirectToTaskForm() {
    window.location.href = '/tasks/compose'; // Redirects to the task form
  }
}
