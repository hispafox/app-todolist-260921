import type { CreateTaskPayload, Task, TaskPriorityValue } from '../types/task'
import type { TaskFormOutput } from '../schemas/taskFormSchema'

export const priorityLabels: Record<TaskPriorityValue, string> = {
  1: 'Baja',
  2: 'Media',
  3: 'Alta',
}

export function formToPayload(values: TaskFormOutput): CreateTaskPayload {
  return {
    title: values.title.trim(),
    description: values.description?.trim() ? values.description.trim() : null,
    priority: values.priority as TaskPriorityValue,
    category: values.category?.trim() ? values.category.trim() : null,
    dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : null,
    assignedUserId: values.assignedUserId ? Number(values.assignedUserId) : null,
  }
}

export function taskToFormDefaults(task?: Task) {
  return {
    title: task?.title ?? '',
    description: task?.description ?? '',
    priority: String(task?.priority ?? 2),
    category: task?.category ?? '',
    dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : '',
    assignedUserId: task?.assignedUserId != null ? String(task.assignedUserId) : '',
  }
}

export function isOverdue(task: Task): boolean {
  if (!task.dueDate || task.isCompleted) {
    return false
  }
  const due = new Date(task.dueDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return due < today
}

export function formatDueDate(dueDate: string): string {
  return new Date(dueDate).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
