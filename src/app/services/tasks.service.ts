import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { DropdownService } from './dropdown.service';
import { Task } from '../interfaces/task.model';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  public groupedTasks$: Observable<{ [status: string]: Task[] }>;

  // Track which filters are applied (for the filter pill display)
  private activeFiltersSubject = new BehaviorSubject<{[key: string]: string[];}>({});
  public activeFilters$ = this.activeFiltersSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private dropdownService: DropdownService
  ) {
    // Initialize the grouped tasks observable
    this.groupedTasks$ = combineLatest([
      this.tasks$,
      this.dropdownService.activeDropdown$,
      this.dropdownService.dropdownData$,
    ]).pipe(
      map(([tasks, _, __]) => {
        // Get all current filter selections
        const selections = this.dropdownService.getAllSelections();

        // Apply filters
        const filteredTasks = this.filterTasks(tasks, selections);

        // Group by status
        return this.groupTasksByStatus(filteredTasks);
      })
    );
  }

  // Public method to initialize the service (called from component)
  initialize(): void {
    // Load initial tasks
    this.loadTasks();

    // Subscribe to changes in dropdown selections to update active filters
    this.dropdownService.dropdownData$.subscribe(() => {
      this.updateActiveFilters();
    });
  }

  // Reload tasks (can be called after actions that modify tasks)
  refreshTasks(): void {
    this.loadTasks();
  }

  private loadTasks(): void {
    this.apiService
      .get<Task[]>('tasks')
      .pipe(
        catchError((error) => {
          console.error('Error loading tasks:', error);
          return of([]);
        })
      )
      .subscribe((tasks) => {
        this.tasksSubject.next(tasks);
      });
  }

  private filterTasks(
    tasks: Task[],
    filters: { [key: string]: string[] }
  ): Task[] {
    // If no filters are applied, return all tasks
    if (Object.values(filters).every((filterArray) => filterArray.length === 0)) {
      return tasks;
    }

    return tasks.filter((task) => {
      // Check department filter
      if (
        filters['დეპარტამენტი']?.length > 0 &&
        !filters['დეპარტამენტი'].includes(task.department.name)
      ) {
        return false;
      }

      // Check priority filter
      if (
        filters['პრიორიტეტი']?.length > 0 &&
        !filters['პრიორიტეტი'].includes(task.priority.name)
      ) {
        return false;
      }

      // Check employee filter
      if (filters['თანამშრომელი']?.length > 0) {
        const employeeName = `${task.employee.name} ${task.employee.surname}`;
        if (!filters['თანამშრომელი'].includes(employeeName)) {
          return false;
        }
      }

      return true;
    });
  }

  private groupTasksByStatus(tasks: Task[]): { [statusName: string]: Task[] } {
    // Create an empty object to hold tasks grouped by status name
    const grouped: { [statusName: string]: Task[] } = {};

    // Populate the object with empty arrays for each status
    const statuses = [
      'დასაწყები',
      'პროგრესში',
      'მზად ტესტირებისთვის',
      'დასრულებული',
    ];
    statuses.forEach((status) => {
      grouped[status] = [];
    });

    // Add each task to its corresponding status group
    tasks.forEach((task) => {
      if (grouped[task.status.name]) {
        grouped[task.status.name].push(task);
      }
    });

    return grouped;
  }

  private updateActiveFilters(): void {
    const selections = this.dropdownService.getAllSelections();
    const activeFilters: { [key: string]: string[] } = {};

    // Only include non-empty selection arrays
    Object.entries(selections).forEach(([key, value]) => {
      if (value.length > 0) {
        activeFilters[key] = value;
      }
    });

    this.activeFiltersSubject.next(activeFilters);
  }

  // Method to clear all filters
  clearAllFilters(): void {
    ['დეპარტამენტი', 'პრიორიტეტი', 'თანამშრომელი'].forEach((type) => {
      this.dropdownService.updateSelection(type, []);
    });
    this.updateActiveFilters();
  }
}
