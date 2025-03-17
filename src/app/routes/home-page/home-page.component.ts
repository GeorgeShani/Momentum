import { Component, OnInit } from '@angular/core';
import { DropdownButtonComponent } from '../../components/dropdown-button/dropdown-button.component';
import { TaskSectionHeaderComponent } from '../../components/task-section-header/task-section-header.component';
import { Department } from '../../interfaces/department.model';
import { ApiService } from '../../services/api.service';
import { Priority } from '../../interfaces/priority.model';
import { Employee } from '../../interfaces/employee.model';
import { TaskCardComponent } from '../../components/task-card/task-card.component';
import { FilterOptionComponent } from '../../components/filter-option/filter-option.component';
import { DropdownPopoverComponent } from '../../components/dropdown-popover/dropdown-popover.component';

@Component({
  selector: 'app-home-page',
  imports: [
    DropdownButtonComponent,
    TaskSectionHeaderComponent,
    TaskCardComponent,
    FilterOptionComponent,
    DropdownPopoverComponent
],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent implements OnInit {
  departments!: Department[];
  priorities!: Priority[];
  employees!: Employee[];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService
      .get<Department[]>('departments')
      .subscribe((departments) => {
        this.departments = departments;
      });

    this.apiService.get<Priority[]>('priorities').subscribe((priorities) => {
      this.priorities = priorities;
    });

    this.apiService.get<Employee[]>('employees').subscribe((employees) => {
      this.employees = employees;
    });
  }
}
