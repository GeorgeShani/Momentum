import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ValidateTaskFormService {
  validateTitle(title: string): boolean {
    return title.length >= 3 && title.length <= 255;
  }

  validateDescription(description: string): boolean {
    const wordCount = description.trim().split(/\s+/).length;
    return wordCount >= 4 && description.length <= 255;
  }

  validatePriority(priority: string): boolean {
    const validPriorities = ['მაღალი', 'საშუალო', 'დაბალი'];
    return validPriorities.includes(priority);
  }

  validateStatus(status: string): boolean {
    const validStatuses = [
      'დასაწყები',
      'პროგრესში',
      'მზად ტესტირებისთვის',
      'დასრულებული',
    ];

    return validStatuses.includes(status);
  }

  validateDepartment(departmentId: string): boolean {
    return !!departmentId;
  }

  validateResponsibleEmployee(employeeID: number): boolean {
    return !!employeeID;
  }

  validateDeadline(deadline: string): boolean {
    const selectedDate = new Date(deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  }
}
