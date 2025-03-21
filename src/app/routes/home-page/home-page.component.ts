import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownButtonComponent } from '../../components/dropdown-button/dropdown-button.component';
import { DropdownPopoverComponent } from '../../components/dropdown-popover/dropdown-popover.component';
import { FilterOptionComponent } from '../../components/filter-option/filter-option.component';
import { TaskSectionHeaderComponent } from '../../components/task-section-header/task-section-header.component';
import { TaskCardComponent } from '../../components/task-card/task-card.component';
import { TasksService } from '../../services/tasks.service';
import { DropdownService } from '../../services/dropdown.service';
import { Task } from '../../interfaces/task.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-page',
  imports: [
    DropdownButtonComponent,
    TaskSectionHeaderComponent,
    TaskCardComponent,
    FilterOptionComponent,
    DropdownPopoverComponent,
    CommonModule,
  ],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent implements OnInit, OnDestroy {
  groupedTasks: { [status: string]: Task[] } = {};
  activeFilters: { [key: string]: string[] } = {};
  private subscription = new Subscription();

  // Status colors for consistency
  statusColors: Record<string, string> = {
    დასაწყები: '#FFC107',
    პროგრესში: '#FB5607',
    'მზად ტესტირებისთვის': '#FF006E',
    დასრულებული: '#3A86FF',
  };

  statuses = ['დასაწყები', 'პროგრესში', 'მზად ტესტირებისთვის', 'დასრულებული'];

  constructor(
    private tasksService: TasksService,
    private dropdownService: DropdownService
  ) {}

  ngOnInit(): void {
    // Initialize the tasks service
    this.tasksService.initialize();

    // Subscribe to grouped tasks
    this.subscription.add(
      this.tasksService.groupedTasks$.subscribe((tasks) => {
        this.groupedTasks = tasks;
      })
    );

    // Subscribe to active filters
    this.subscription.add(
      this.tasksService.activeFilters$.subscribe((filters) => {
        this.activeFilters = filters;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // Get all active filter values as a flat array for display
  get activeFilterValues(): { type: string; value: string }[] {
    const result: { type: string; value: string }[] = [];

    Object.entries(this.activeFilters).forEach(([type, values]) => {
      values.forEach((value) => {
        result.push({ type, value });
      });
    });

    return result;
  }

  // Remove a specific filter
  removeFilter(type: string, value: string): void {
    const currentSelections = this.dropdownService.getSelectedItems(type);
    const updatedSelections = currentSelections.filter(
      (item) => item !== value
    );
    this.dropdownService.updateSelection(type, updatedSelections);
    this.activeFilters[type] = updatedSelections;
    this.activeFilters = { ...this.activeFilters };
    this.refreshTasks();
  }

  // Clear all filters
  clearAllFilters(): void {
    this.tasksService.clearAllFilters();
    this.refreshTasks();
  }

  // Get tasks for a specific status
  getTasksForStatus(status: string): Task[] {
    return this.groupedTasks[status] || [];
  }

  refreshTasks(): void {
    this.tasksService.refreshTasks();
  }
}
