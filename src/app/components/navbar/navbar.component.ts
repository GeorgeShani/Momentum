import { Component } from '@angular/core';
import { EmployeeModalService } from '../../services/employee-modal.service';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  constructor(private modalService: EmployeeModalService) {}

  openEmployeeModal(): void {
    this.modalService.openModal();
  }

  redirectToHome() {
    window.location.href = '/';
  }

  redirectToTaskForm() {
    window.location.href = '/tasks/compose';
  }
}
