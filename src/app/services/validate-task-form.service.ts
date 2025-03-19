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

  validatePriority(priorityID: number): boolean {
    const priorityIdentifiers: number[] = [1, 2, 3];
    return priorityIdentifiers.includes(priorityID);
  }

  validateStatus(statusID: number): boolean {
    const statusIdentifiers: number[] = [1, 2, 3, 4];
    return statusIdentifiers.includes(statusID);
  }

  validateDepartment(departmentID: number): boolean {
    const departmentIdentifiers: number[] = [1, 2, 3, 4, 5, 6, 7];
    return departmentIdentifiers.includes(departmentID);
  }

  validateResponsibleEmployee(employeeID: number | null): boolean {
    return !!employeeID;
  }

  validateDeadline(deadline: Date): boolean {
    if (!(deadline instanceof Date) || isNaN(deadline.getTime())) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return deadline >= today;
  }
}
