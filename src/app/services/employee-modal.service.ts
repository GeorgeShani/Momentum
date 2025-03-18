import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeModalService {
  // BehaviorSubject to track the visibility state of the modal
  private isVisible: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  // Observable that components can subscribe to
  isVisible$: Observable<boolean> = this.isVisible.asObservable();

  constructor() {}

  // Method to open the modal
  openModal(): void {
    console.log('Modal service: Opening modal');
    this.isVisible.next(true);
  }

  closeModal(): void {
    console.log('Modal service: Closing modal');
    this.isVisible.next(false);
  }
}
