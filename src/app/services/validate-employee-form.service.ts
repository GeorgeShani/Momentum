import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ValidateEmployeeFormService {
  validateFirstName(name: string): boolean {
    const regex = /^[a-zA-Zა-ჰ]{2,255}$/;
    return regex.test(name);
  }

  validateLastName(lastName: string): boolean {
    const regex = /^[a-zA-Zა-ჰ]{2,255}$/;
    return regex.test(lastName);
  }

  validateAvatar(file: File | null): boolean {
    if (!file) return false;
    const maxSize = 600 * 1024; // 600KB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    return file.size <= maxSize && allowedTypes.includes(file.type);
  }

  validateDepartment(departmentID: number): boolean {
    return !!departmentID;
  }
}
