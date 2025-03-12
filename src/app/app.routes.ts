import { Routes } from '@angular/router';
import { HomeComponent } from './routes/home/home.component';
import { TaskDetailsComponent } from './routes/task-details/task-details.component';
import { ErrorComponent } from './routes/error/error.component';

export const routes: Routes = [
    { path: "", redirectTo: "home", pathMatch: "full" },
    { path: "home", component: HomeComponent },
    { path: "task/:id", component: TaskDetailsComponent },
    { path: "**", component: ErrorComponent },
];
