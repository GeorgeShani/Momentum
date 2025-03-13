import { Routes } from '@angular/router';
import { HomePageComponent } from './routes/home-page/home-page.component';
import { TaskDetailsPageComponent } from './routes/task-details-page/task-details-page.component';
import { TaskFormPageComponent } from './routes/task-form-page/task-form-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  {
    path: 'tasks',
    children: [
      { path: 'compose', component: TaskFormPageComponent },
      { path: ':id', component: TaskDetailsPageComponent },
    ],
  },
];
