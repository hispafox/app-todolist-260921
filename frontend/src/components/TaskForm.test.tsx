import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { screen, waitFor } from '@testing-library/react'
import { TaskForm } from '../components/TaskForm'
import { renderWithQueryClient } from '../test/utils'

describe('TaskForm', () => {
  it('muestra un error de validación cuando falta el título', async () => {
    const onSubmit = vi.fn()
    renderWithQueryClient(
      <TaskForm
        isSubmitting={false}
        onSubmit={onSubmit}
        onCancelEdit={() => {}}
      />,
    )

    await userEvent.click(screen.getByRole('button', { name: /crear tarea/i }))

    expect(await screen.findByText(/el título es obligatorio/i)).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('envía los datos del formulario cuando son válidos', async () => {
    const onSubmit = vi.fn()
    renderWithQueryClient(
      <TaskForm
        isSubmitting={false}
        onSubmit={onSubmit}
        onCancelEdit={() => {}}
      />,
    )

    await userEvent.type(screen.getByLabelText(/título/i), 'Preparar demo')
    await userEvent.type(screen.getByLabelText(/categoría/i), 'Trabajo')
    await userEvent.click(screen.getByRole('button', { name: /crear tarea/i }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
    const submitted = onSubmit.mock.calls[0][0]
    expect(submitted.title).toBe('Preparar demo')
    expect(submitted.category).toBe('Trabajo')
  })

  it('muestra el botón de cancelar en modo edición', () => {
    renderWithQueryClient(
      <TaskForm
        editingTask={{
          id: 1,
          title: 'Existente',
          description: null,
          priority: 2,
          category: null,
          isCompleted: false,
          dueDate: null,
          createdAt: '2026-01-01T00:00:00Z',
          updatedAt: '2026-01-01T00:00:00Z',
        }}
        isSubmitting={false}
        onSubmit={vi.fn()}
        onCancelEdit={() => {}}
      />,
    )

    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /guardar cambios/i })).toBeInTheDocument()
  })
})
