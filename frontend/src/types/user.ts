export interface User {
  id: number
  name: string
  email: string
  color: string
}

export interface CreateUserPayload {
  name: string
  email: string
  color: string
}

export type UpdateUserPayload = CreateUserPayload
