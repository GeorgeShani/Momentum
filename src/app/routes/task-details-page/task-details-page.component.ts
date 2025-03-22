import { Component, OnInit } from '@angular/core';
import { TaskPriorityComponent } from '../../components/task-priority/task-priority.component';
import { DepartmentComponent } from '../../components/department/department.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { Status } from '../../interfaces/status.model';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LeftIconComponent } from '../../components/left-icon/left-icon.component';
import { Task } from '../../interfaces/task.model';
import { CommonModule } from '@angular/common';
import { Comment } from '../../interfaces/comment.model';
import { CommentSectionData } from '../../interfaces/comment-section-data.model';

@Component({
  selector: 'app-task-details-page',
  imports: [
    TaskPriorityComponent,
    DepartmentComponent,
    NgSelectModule,
    CommonModule,
    FormsModule,
    LeftIconComponent,
  ],
  templateUrl: './task-details-page.component.html',
  styleUrl: './task-details-page.component.css',
})
export class TaskDetailsPageComponent implements OnInit {
  statuses!: Status[];
  selectedStatusID: number = 0;
  task!: Task;
  taskID!: number;
  taskComments!: Comment[];
  comment: string = '';
  subComment: string = '';
  parentCommentId: number | null = null;
  georgianDays: string[] = ['კვ', 'ორშ', 'სამ', 'ოთხ', 'ხუთ', 'პარ', 'შაბ'];
  formattedDeadlineDateString: string = '';
  replyVisibility: { [commentId: number]: boolean } = {};

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit(): void {
    // Get task ID from route params
    const idParam = this.route.snapshot.paramMap.get('id');
    this.taskID = idParam ? parseInt(idParam, 10) : NaN;

    // Fetch statuses for task status options
    this.apiService.get<Status[]>('statuses').subscribe((data) => {
      this.statuses = data;
    });

    // Fetch task details
    this.apiService.get<Task>(`tasks/${this.taskID}`).subscribe((data) => {
      this.task = data;
      this.selectedStatusID = data.status.id;

      // Format task due date for display
      const dueDate = new Date(this.task.due_date);
      console.log(this.task.due_date);
      this.formattedDeadlineDateString = `${this.georgianDays[dueDate.getDay()]} - ${dueDate.getDate()}/${dueDate.getMonth() + 1}/${dueDate.getFullYear()}`;
    });

    // Fetch task comments
    this.fetchComments();
  }

  // Toggle visibility of reply input for a comment
  toggleReplyInput(commentId: number): void {
    this.replyVisibility[commentId] = !this.replyVisibility[commentId];
  }

  // Fetch comments for the current task
  fetchComments(): void {
    this.apiService
      .get<Comment[]>(`tasks/${this.taskID}/comments`)
      .subscribe((data) => {
        this.taskComments = data;
      });
  }

  // Send new comment or reply to a comment
  sendComment(comment: string, parentCommentId: number | null = null): void {
    const commentData: CommentSectionData = {
      text: comment,
      parent_id: parentCommentId,
    };

    this.apiService
      .post(`tasks/${this.taskID}/comments`, commentData)
      .subscribe({
        next: (response) => {
          console.log('Comment created successfully', response);
          this.resetForm();
          this.fetchComments();

          // Toggle reply input visibility if needed
          if (
            parentCommentId !== null &&
            this.replyVisibility[parentCommentId]
          ) {
            this.toggleReplyInput(parentCommentId);
          }
        },
        error: (error) => {
          console.error('Error creating comment', error);
          alert('კომენტარი ვერ შეიქმნა. გთხოვთ, მოგვიანებით სცადოთ');
        },
      });
  }

  // Update task status
  updateTaskStatus(statusId: number): void {
    this.apiService
      .put(`tasks/${this.taskID}`, {
        status_id: statusId,
      })
      .subscribe({
        next: (response) => {
          console.log('Task status updated successfully', response);
        },
        error: (error) => {
          console.error('Error updating task status', error);
          alert('დავალების სტატუსი ვერ განახლდა. გთხოვთ, მოგვიანებით სცადოთ');
        },
      });
  }

  // Reset comment form fields
  resetForm(): void {
    this.comment = '';
    this.subComment = '';
    this.parentCommentId = null;
  }
}
