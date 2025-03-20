import { Component } from '@angular/core';
import { DropdownButtonComponent } from '../../components/dropdown-button/dropdown-button.component';
import { TaskSectionHeaderComponent } from '../../components/task-section-header/task-section-header.component';
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
export class HomePageComponent {
  
}
