import { ApiError, type ApiValidationProblem } from './ApiError'
import type { CreateUserPayload, UpdateUserPayload, User } from '../types/user'

const BASE_URL = '/api/users'

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

export async function fetchUsers(signal?: AbortSignal): Promise<User[]> {
  const response = await fetch(BASE_URL, { signal })
  if (!response.ok) {
    return parseError(response)
  }
  return (await response.json()) as User[]
}

export async function createUser(payload: CreateUserPayload): Promise<User> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    return parseError(response)
  }
  return (await response.json()) as User
}

export async function updateUser(id: number, payload: UpdateUserPayload): Promise<User> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    return parseError(response)
  }
  return (await response.json()) as User
}

export async function deleteUser(id: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
  if (!response.ok) {
    return parseError(response)
  }
}
