import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TaskList } from '../components/TaskList'
import type { Task } from '../types/task'

const task: Task = {
  id: 1,
  title: 'Tarea de prueba',
  description: null,
  priority: 2,
  category: null,
  isCompleted: false,
  dueDate: null,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
}

const noop = {
  onRetry: vi.fn(),
  onToggleComplete: vi.fn(),
  onEdit: vi.fn(),
  onDelete: vi.fn(),
}

describe('TaskList', () => {
  it('muestra el estado de carga', () => {
    render(
      <TaskList tasks={[]} isLoading isError={false} hasActiveFilters={false} {...noop} />,
    )
    expect(screen.getByText(/cargando tareas/i)).toBeInTheDocument()
  })

  it('muestra el estado de error con botón de reintento', () => {
    render(
      <TaskList tasks={[]} isLoading={false} isError hasActiveFilters={false} {...noop} />,
    )
    expect(screen.getByText(/no se han podido cargar/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reintentar/i })).toBeInTheDocument()
  })

  it('muestra el estado vacío inicial cuando no hay tareas ni filtros', () => {
    render(
      <TaskList tasks={[]} isLoading={false} isError={false} hasActiveFilters={false} {...noop} />,
    )
    expect(screen.getByText(/tu lista está despejada/i)).toBeInTheDocument()
  })

  it('muestra el estado sin coincidencias cuando hay filtros activos', () => {
    render(
      <TaskList tasks={[]} isLoading={false} isError={false} hasActiveFilters {...noop} />,
    )
    expect(screen.getByText(/no hay coincidencias/i)).toBeInTheDocument()
  })

  it('renderiza las tareas recibidas', () => {
    render(
      <TaskList tasks={[task]} isLoading={false} isError={false} hasActiveFilters={false} {...noop} />,
    )
    expect(screen.getByText('Tarea de prueba')).toBeInTheDocument()
  })
})
