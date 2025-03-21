import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Department } from '../interfaces/department.model';
import { Priority } from '../interfaces/priority.model';
import { Employee } from '../interfaces/employee.model';
import { DropdownData } from '../interfaces/dropdown-data.model';

@Injectable({
  providedIn: 'root',
})
export class DropdownService {
  private activeDropdownSubject = new BehaviorSubject<string | null>(null);
  public activeDropdown$ = this.activeDropdownSubject.asObservable();

  private dropdownDataSubject = new BehaviorSubject<DropdownData | null>(null);
  public dropdownData$ = this.dropdownDataSubject.asObservable();

  // Stores dropdown options
  private dropdownItems: { [key: string]: string[] } = {
    დეპარტამენტი: [],
    პრიორიტეტი: [],
    თანამშრომელი: [],
  };

  // Stores selected values
  private selections: { [key: string]: string[] } = {
    დეპარტამენტი: [],
    პრიორიტეტი: [],
    თანამშრომელი: [],
  };

  // Tracks loading state
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.loadAllDropdownData();
  }

  private loadAllDropdownData(): void {
    this.loadingSubject.next(true);

    // Fetch dropdown data from API
    const departments$ = this.apiService.get<Department[]>('departments').pipe(
      map((response) => response.map((item) => item.name)),
      catchError((err) => {
        console.error('Error loading departments:', err);
        return [];
      })
    );

    const priorities$ = this.apiService.get<Priority[]>('priorities').pipe(
      map((response) => response.map((item) => item.name)),
      catchError((err) => {
        console.error('Error loading priorities:', err);
        return [];
      })
    );

    const employees$ = this.apiService.get<Employee[]>('employees').pipe(
      map((response) => response.map((item) => `${item.name} ${item.surname}`)),
      catchError((err) => {
        console.error('Error loading employees:', err);
        return [];
      })
    );

    // Fetch all data in parallel
    forkJoin({
      departments: departments$,
      priorities: priorities$,
      employees: employees$,
    }).subscribe({
      next: (result) => {
        this.dropdownItems['დეპარტამენტი'] = result.departments;
        this.dropdownItems['პრიორიტეტი'] = result.priorities;
        this.dropdownItems['თანამშრომელი'] = result.employees;
        this.loadingSubject.next(false);
      },
      error: (error) => {
        console.error('Error loading dropdown data:', error);
        this.loadingSubject.next(false);
      },
    });
  }

  toggleDropdown(type: string | null): void {
    if (this.activeDropdownSubject.value === type || type === null) {
      // Close dropdown
      this.activeDropdownSubject.next(null);
      this.dropdownDataSubject.next(null);
    } else {
      // Open dropdown with stored data
      this.activeDropdownSubject.next(type);

      const data: DropdownData = {
        type: type as any,
        items: this.dropdownItems[type] || [],
        selectedItems: this.selections[type] || [],
      };

      this.dropdownDataSubject.next(data);
    }
  }

  updateSelection(type: string, items: string[]): void {
    this.selections[type] = [...items];

    // Update dropdown data if active
    if (this.activeDropdownSubject.value === type) {
      this.dropdownDataSubject.next({
        type: type as any,
        items: this.dropdownItems[type] || [],
        selectedItems: this.selections[type] || [],
      });
    }
  }

  getSelectedItems(type: string): string[] {
    return this.selections[type] || [];
  }

  getAllSelections(): { [key: string]: string[] } {
    return { ...this.selections };
  }

  // Reload dropdown data if needed
  refreshDropdownData(): void {
    this.loadAllDropdownData();
  }
}
