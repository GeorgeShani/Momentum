import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Department } from '../interfaces/department.model';
import { Priority } from '../interfaces/priority.model';
import { Employee } from '../interfaces/employee.model';

interface DropdownData {
  type: 'დეპარტამენტი' | 'პრიორიტეტი' | 'თანამშრომელი';
  items: string[];
  selectedItems: string[];
}

@Injectable({
  providedIn: 'root',
})
export class DropdownService {
  private activeDropdownSubject = new BehaviorSubject<string | null>(null);
  public activeDropdown$ = this.activeDropdownSubject.asObservable();

  private dropdownDataSubject = new BehaviorSubject<DropdownData | null>(null);
  public dropdownData$ = this.dropdownDataSubject.asObservable();

  // Store dropdown data
  private dropdownItems: { [key: string]: string[] } = {
    დეპარტამენტი: [],
    პრიორიტეტი: [],
    თანამშრომელი: [],
  };

  // Store selections separately
  private selections: { [key: string]: string[] } = {
    დეპარტამენტი: [],
    პრიორიტეტი: [],
    თანამშრომელი: [],
  };

  // Track loading state
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.loadAllDropdownData();
  }

  private loadAllDropdownData(): void {
    this.loadingSubject.next(true);

    // Create API requests for all dropdown data
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

    // Load all data in parallel
    forkJoin({
      departments: departments$,
      priorities: priorities$,
      employees: employees$,
    }).subscribe(
      (result) => {
        this.dropdownItems['დეპარტამენტი'] = result.departments;
        this.dropdownItems['პრიორიტეტი'] = result.priorities;
        this.dropdownItems['თანამშრომელი'] = result.employees;
        this.loadingSubject.next(false);
      },
      (error) => {
        console.error('Error loading dropdown data:', error);
        this.loadingSubject.next(false);
      }
    );
  }

  toggleDropdown(type: string | null): void {
    if (this.activeDropdownSubject.value === type || type === null) {
      // Explicitly clear selection and notify subscribers
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

    // Emit an event to notify subscribers that selections have changed
    const currentDropdown = this.activeDropdownSubject.value;
    if (currentDropdown === type) {
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

  // Method to reload dropdown data if needed
  refreshDropdownData(): void {
    this.loadAllDropdownData();
  }
}
