import { Department } from "./department.model";
import { Employee } from "./employee.model";
import { Priority } from "./priority.model";
import { Status } from "./status.model";

export interface Task {
    id: number;
    name: string;
    description: string;
    due_date: Date;
    status: Status;
    priority: Priority;
    department: Department;
    employee: Employee;
}