import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { TaskItem } from '../components/TaskItem'
import type { Task } from '../types/task'

const baseTask: Task = {
  id: 7,
  title: 'Revisar PRD',
  description: 'Confirmar alcance',
  priority: 3,
  category: 'Trabajo',
  isCompleted: false,
  dueDate: '2000-01-01T00:00:00Z',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
}

describe('TaskItem', () => {
  it('muestra título, categoría y prioridad', () => {
    render(
      <TaskItem
        task={baseTask}
        onToggleComplete={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    )

    expect(screen.getByText('Revisar PRD')).toBeInTheDocument()
    expect(screen.getByText('Trabajo')).toBeInTheDocument()
    expect(screen.getByText('Alta')).toBeInTheDocument()
  })

  it('marca las tareas vencidas', () => {
    render(
      <TaskItem
        task={baseTask}
        onToggleComplete={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    )

    expect(screen.getByText(/vencida/i)).toBeInTheDocument()
  })

  it('invoca las acciones de completar, editar y eliminar', async () => {
    const onToggleComplete = vi.fn()
    const onEdit = vi.fn()
    const onDelete = vi.fn()

    render(
      <TaskItem
        task={baseTask}
        onToggleComplete={onToggleComplete}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    )

    await userEvent.click(screen.getByRole('checkbox'))
    await userEvent.click(screen.getByRole('button', { name: /editar revisar prd/i }))
    await userEvent.click(screen.getByRole('button', { name: /eliminar revisar prd/i }))

    expect(onToggleComplete).toHaveBeenCalledWith(baseTask)
    expect(onEdit).toHaveBeenCalledWith(baseTask)
    expect(onDelete).toHaveBeenCalledWith(baseTask)
  })
})
