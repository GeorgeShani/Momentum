export interface Comment {
    id: number;
    text: string;
    task_id: number;
    parent_id: number | null;
}