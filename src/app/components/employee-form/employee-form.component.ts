import { Component, OnInit, OnDestroy } from '@angular/core';
import { CheckIconComponent } from "../check-icon/check-icon.component";
import { EmployeeModalService } from '../../services/employee-modal.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-form',
  imports: [CheckIconComponent, CommonModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css',
})
export class EmployeeFormComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();

  isVisible: boolean = false;

  constructor(public modalService: EmployeeModalService) {}

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
