export interface TaskFormData {
  name: string;
  description: string;
  due_date: string;
  status_id: number;
  employee_id: number | null;
  priority_id: number;
}
