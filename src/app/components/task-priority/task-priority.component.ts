import { Component } from '@angular/core';

@Component({
  selector: 'app-task-priority',
  imports: [],
  templateUrl: './task-priority.component.html',
  styleUrl: './task-priority.component.css',
})
export class TaskPriorityComponent {  
  shortNamesDictionary: Record<string, string> = {
    'ადმინისტრაციის დეპარტამენტი': 'ადმინი',
    'ადამიანური რესურსების დეპარტამენტი': 'HR',
    'ფინანსების დეპარტამენტი': 'ფინანსები',
    'გაყიდვები და მარკეტინგის დეპარტამენტი': 'მარკეტინგი',
    'ლოჯოსტიკის დეპარტამენტი': 'ლოჯისტიკა',
    'ტექნოლოგიების დეპარტამენტი': 'IT',
    'მედიის დეპარტამენტი': 'დიზაინი',
  };

  colorsDictionary: Record<string, string> = {
    'ადმინისტრაციის დეპარტამენტი': '#6AFFC0',
    'ადამიანური რესურსების დეპარტამენტი': '#C689FF',
    'ფინანსების დეპარტამენტი': '#6AFFC0',
    'გაყიდვები და მარკეტინგის დეპარტამენტი': '#FD9A6A',
    'ლოჯოსტიკის დეპარტამენტი': '#89B6FF',
    'ტექნოლოგიების დეპარტამენტი': '#FFD86D',
    'მედიის დეპარტამენტი': '#FF66A8',
  };
}
