export const TaskPriority = {
  Low: 1,
  Medium: 2,
  High: 3,
} as const

export type TaskPriorityValue = (typeof TaskPriority)[keyof typeof TaskPriority]

export type StatusFilter = 'all' | 'pending' | 'completed'

export interface Task {
  id: number
  title: string
  description: string | null
  priority: TaskPriorityValue
  category: string | null
  isCompleted: boolean
  dueDate: string | null
  createdAt: string
  updatedAt: string
}

export interface TaskFilters {
  search: string
  status: StatusFilter
  priority: TaskPriorityValue | 'all'
  category: string | 'all'
}

export interface CreateTaskPayload {
  title: string
  description: string | null
  priority: TaskPriorityValue
  category: string | null
  dueDate: string | null
}

export type UpdateTaskPayload = CreateTaskPayload
