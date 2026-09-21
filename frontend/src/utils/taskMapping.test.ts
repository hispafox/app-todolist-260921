import { describe, expect, it } from 'vitest'
import {
  formToPayload,
  isOverdue,
  taskToFormDefaults,
} from '../utils/taskMapping'
import type { Task } from '../types/task'

function buildTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 1,
    title: 'Tarea',
    description: null,
    priority: 2,
    category: null,
    isCompleted: false,
    dueDate: null,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

describe('taskMapping', () => {
  it('formToPayload convierte cadenas vacías en null', () => {
    const payload = formToPayload({
      title: '  Comprar pan  ',
      description: '   ',
      priority: 3,
      category: '',
      dueDate: '',
    })

    expect(payload.title).toBe('Comprar pan')
    expect(payload.description).toBeNull()
    expect(payload.category).toBeNull()
    expect(payload.dueDate).toBeNull()
    expect(payload.priority).toBe(3)
  })

  it('formToPayload transforma la fecha a ISO', () => {
    const payload = formToPayload({
      title: 'Con fecha',
      priority: 1,
      dueDate: '2026-05-10',
    })

    expect(payload.dueDate).toContain('2026-05-10')
  })

  it('isOverdue devuelve false para tareas completadas', () => {
    const task = buildTask({ isCompleted: true, dueDate: '2000-01-01T00:00:00Z' })
    expect(isOverdue(task)).toBe(false)
  })

  it('isOverdue detecta tareas vencidas pendientes', () => {
    const task = buildTask({ dueDate: '2000-01-01T00:00:00Z' })
    expect(isOverdue(task)).toBe(true)
  })

  it('taskToFormDefaults rellena valores por defecto sin tarea', () => {
    const defaults = taskToFormDefaults()
    expect(defaults.title).toBe('')
    expect(defaults.priority).toBe('2')
  })
})
