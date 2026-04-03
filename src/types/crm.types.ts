export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskType = 'call' | 'email' | 'meeting' | 'other';

export interface Ticket {
    id: number;
    code: string;
    title: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    customerId: number;
    customerName: string;
    assignedToId?: number;
    assignedToName?: string; // Derived for UI
    createdAt: string;
    updatedAt: string;
}

export interface CrmTask {
    id: number;
    title: string;
    description: string;
    dueDate: string;
    status: TaskStatus;
    priority: TaskPriority;
    type: TaskType;
    customerId: number;
    customerName: string;
    assignedToId?: number;
    assignedToName?: string;
    relatedTicketId?: number;
    createdAt: string;
}

export interface CreateTicketDto {
    title: string;
    description: string;
    priority: TicketPriority;
    customerId: number;
    assignedToId?: number;
}

export interface CreateTaskDto {
    title: string;
    description: string;
    dueDate: string;
    priority: TaskPriority;
    type: TaskType;
    customerId: number;
    assignedToId?: number;
    relatedTicketId?: number;
}

export interface UpdateTicketDto extends Partial<CreateTicketDto> {
    status?: TicketStatus;
}
export interface UpdateTaskDto extends Partial<CreateTaskDto> {
    status?: TaskStatus;
}
