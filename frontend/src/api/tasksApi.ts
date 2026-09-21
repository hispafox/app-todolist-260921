import { ApiError, type ApiValidationProblem } from './ApiError'
import type {
  CreateTaskPayload,
  Task,
  TaskFilters,
  UpdateTaskPayload,
} from '../types/task'

const BASE_URL = '/api/tasks'

function buildQueryString(filters: TaskFilters): string {
  const params = new URLSearchParams()

  if (filters.search.trim()) {
    params.set('search', filters.search.trim())
  }
  if (filters.status !== 'all') {
    params.set('status', filters.status)
  }
  if (filters.priority !== 'all') {
    params.set('priority', String(filters.priority))
  }
  if (filters.category !== 'all') {
    params.set('category', filters.category)
  }

  const query = params.toString()
  return query ? `?${query}` : ''
}

async function parseError(response: Response): Promise<never> {
  let problem: ApiValidationProblem | undefined
  try {
    problem = (await response.json()) as ApiValidationProblem
  } catch {
    problem = undefined
  }

  const message = problem?.detail ?? problem?.title ?? `Error ${response.status}`
  throw new ApiError(message, response.status, problem)
}

export async function fetchTasks(
  filters: TaskFilters,
  signal?: AbortSignal,
): Promise<Task[]> {
  const response = await fetch(`${BASE_URL}${buildQueryString(filters)}`, { signal })
  if (!response.ok) {
    return parseError(response)
  }
  return (await response.json()) as Task[]
}

export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    return parseError(response)
  }
  return (await response.json()) as Task
}

export async function updateTask(
  id: number,
  payload: UpdateTaskPayload,
): Promise<Task> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    return parseError(response)
  }
  return (await response.json()) as Task
}

export async function completeTask(id: number): Promise<Task> {
  const response = await fetch(`${BASE_URL}/${id}/complete`, { method: 'PATCH' })
  if (!response.ok) {
    return parseError(response)
  }
  return (await response.json()) as Task
}

export async function reopenTask(id: number): Promise<Task> {
  const response = await fetch(`${BASE_URL}/${id}/reopen`, { method: 'PATCH' })
  if (!response.ok) {
    return parseError(response)
  }
  return (await response.json()) as Task
}

export async function deleteTask(id: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
  if (!response.ok) {
    return parseError(response)
  }
}
