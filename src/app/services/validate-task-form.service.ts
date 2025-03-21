import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ValidateTaskFormService {
  private readonly priorityIDs = new Set([1, 2, 3]);
  private readonly statusIDs = new Set([1, 2, 3, 4]);
  private readonly departmentIDs = new Set([1, 2, 3, 4, 5, 6, 7]);

  // Validates task title length (3-255 characters)
  validateTitle(title: string): boolean {
    return title.length >= 3 && title.length <= 255;
  }

  // Validates description (4+ words, <= 255 characters)
  validateDescription(description: string): boolean {
    const wordCount = description.trim().split(/\s+/).length;
    return wordCount >= 4 && description.length <= 255;
  }

  // Validates if priority is valid
  validatePriority(priorityID: number): boolean {
    return this.priorityIDs.has(priorityID);
  }

  // Validates if status is valid
  validateStatus(statusID: number): boolean {
    return this.statusIDs.has(statusID);
  }

  // Validates if department is valid
  validateDepartment(departmentID: number): boolean {
    return this.departmentIDs.has(departmentID);
  }

  // Validates if employee ID is not null
  validateResponsibleEmployee(employeeID: number | null): boolean {
    return Boolean(employeeID);
  }

  // Validates if deadline is a valid future date
  validateDeadline(deadline: Date): boolean {
    return (
      deadline instanceof Date &&
      !isNaN(deadline.getTime()) &&
      deadline.getTime() >= new Date().setHours(0, 0, 0, 0)
    );
  }
}
