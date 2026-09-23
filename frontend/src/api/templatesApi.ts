import { ApiError, type ApiValidationProblem } from './ApiError'
import type {
  CreateTaskFromTemplatePayload,
  CreateTaskTemplatePayload,
  TaskTemplate,
  UpdateTaskTemplatePayload,
} from '../types/template'
import type { Task } from '../types/task'

const BASE_URL = '/api/templates'

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

export async function fetchTemplates(signal?: AbortSignal): Promise<TaskTemplate[]> {
  const response = await fetch(BASE_URL, { signal })
  if (!response.ok) {
    return parseError(response)
  }
  return (await response.json()) as TaskTemplate[]
}

export async function createTemplate(payload: CreateTaskTemplatePayload): Promise<TaskTemplate> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    return parseError(response)
  }
  return (await response.json()) as TaskTemplate
}

export async function updateTemplate(
  id: number,
  payload: UpdateTaskTemplatePayload,
): Promise<TaskTemplate> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    return parseError(response)
  }
  return (await response.json()) as TaskTemplate
}

export async function deleteTemplate(id: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
  if (!response.ok) {
    return parseError(response)
  }
}

export async function createTaskFromTemplate(
  templateId: number,
  payload: CreateTaskFromTemplatePayload,
): Promise<Task> {
  const response = await fetch(`${BASE_URL}/${templateId}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    return parseError(response)
  }
  return (await response.json()) as Task
}
