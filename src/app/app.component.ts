import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, EmployeeFormComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
