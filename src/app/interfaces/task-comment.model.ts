import { Comment } from './comment.model';

export interface TaskComment {
    id: number;
    text: string;
    task_id: number;
    parent_id: number | null;
    author_avatar: string;
    author_nickname: string;
    sub_comments: Comment[];
}