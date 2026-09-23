import type { TaskPriorityValue } from './task'

export interface TaskTemplate {
  id: number
  title: string
  description: string | null
  priority: TaskPriorityValue
  category: string | null
}

export interface CreateTaskTemplatePayload {
  title: string
  description: string | null
  priority: TaskPriorityValue
  category: string | null
}

export type UpdateTaskTemplatePayload = CreateTaskTemplatePayload

export interface CreateTaskFromTemplatePayload {
  dueDate: string | null
  assignedUserId: number | null
}
