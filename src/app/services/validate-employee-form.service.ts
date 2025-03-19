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

  validateAvatar(imageUrl: string | null): boolean {
    if (!imageUrl) return false;

    const maxSize = 600 * 1024; // 600KB
    const allowedExtensions = ['jpeg', 'jpg', 'png', 'gif', 'webp'];

    // Check if it's a Base64 image
    const base64Pattern = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/;
    if (base64Pattern.test(imageUrl)) {
      const base64Data = imageUrl.split(',')[1]; // Extract Base64 content
      const byteLength = (base64Data.length * 3) / 4; // Approximate file size

      return byteLength <= maxSize;
    }

    // Check if it's an external URL with a valid image extension
    try {
      const url = new URL(imageUrl);
      const extension = url.pathname.split('.').pop()?.toLowerCase();

      return !!extension && allowedExtensions.includes(extension);
    } catch {
      return false; // Invalid URL
    }
  }

  validateDepartment(department: string): boolean {
    const departmentIdentifiers: string[] = [
      'ადმინისტრაციის დეპარტამენტი',
      'ადამიანური რესურსების დეპარტამენტი',
      'ფინანსების დეპარტამენტი',
      'გაყიდვები და მარკეტინგის დეპარტამენტი',
      'ლოჯოსტიკის დეპარტამენტი',
      'ტექნოლოგიების დეპარტამენტი',
      'მედიის დეპარტამენტი',
    ];

    return departmentIdentifiers.includes(department);
  }
}
