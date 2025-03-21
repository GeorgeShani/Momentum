import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeModalService {
  // BehaviorSubject to track the visibility state of the modal
  private isVisible: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  // Observable that components can subscribe to
  isVisible$: Observable<boolean> = this.isVisible.asObservable();

  // Method to open the modal
  openModal(): void {
    this.isVisible.next(true);
  }

  closeModal(): void {
    this.isVisible.next(false);
  }
}
