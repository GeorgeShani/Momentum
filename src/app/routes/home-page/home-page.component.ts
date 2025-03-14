import { Component } from '@angular/core';
import { DropdownButtonComponent } from "../../components/dropdown-button/dropdown-button.component";
import { TaskSectionHeaderComponent } from "../../components/task-section-header/task-section-header.component";

@Component({
  selector: 'app-home-page',
  imports: [DropdownButtonComponent, TaskSectionHeaderComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

}
