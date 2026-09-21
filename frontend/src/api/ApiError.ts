export interface ApiValidationProblem {
  title?: string
  detail?: string
  errors?: Record<string, string[]>
}

export class ApiError extends Error {
  readonly status: number
  readonly problem?: ApiValidationProblem

  constructor(message: string, status: number, problem?: ApiValidationProblem) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.problem = problem
  }
}
