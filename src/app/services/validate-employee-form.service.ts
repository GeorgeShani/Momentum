import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ValidateEmployeeFormService {
  // Validates first name (Georgian & Latin, 2-255 chars)
  validateFirstName(name: string): boolean {
    return /^[a-zA-Zა-ჰ]{2,255}$/.test(name);
  }

  // Validates last name (Georgian & Latin, 2-255 chars)
  validateLastName(lastName: string): boolean {
    return /^[a-zA-Zა-ჰ]{2,255}$/.test(lastName);
  }

  // Validates avatar (Base64 < 600KB or valid image URL)
  validateAvatar(imageUrl: string | null): boolean {
    if (!imageUrl) return false;

    const maxSize = 600 * 1024; // 600KB
    const allowedExtensions = ['jpeg', 'jpg', 'png', 'gif', 'webp'];

    // Check Base64 format
    const base64Pattern = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/;
    if (base64Pattern.test(imageUrl)) {
      const base64Data = imageUrl.split(',')[1];
      return (base64Data.length * 3) / 4 <= maxSize;
    }

    // Check valid image URL
    try {
      const ext = new URL(imageUrl).pathname.split('.').pop()?.toLowerCase();
      return !!ext && allowedExtensions.includes(ext);
    } catch {
      return false;
    }
  }

  // Validates department selection
  validateDepartment(department: string): boolean {
    return [
      'ადმინისტრაციის დეპარტამენტი',
      'ადამიანური რესურსების დეპარტამენტი',
      'ფინანსების დეპარტამენტი',
      'გაყიდვები და მარკეტინგის დეპარტამენტი',
      'ლოჯოსტიკის დეპარტამენტი',
      'ტექნოლოგიების დეპარტამენტი',
      'მედიის დეპარტამენტი',
    ].includes(department);
  }
}
