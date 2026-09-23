import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { CreateTaskFromTemplateDialog } from '../components/CreateTaskFromTemplateDialog'
import type { TaskTemplate } from '../types/template'
import type { User } from '../types/user'

const template: TaskTemplate = {
  id: 1,
  title: 'Revisión semanal',
  description: null,
  priority: 3,
  category: 'Trabajo',
}

const users: User[] = [{ id: 7, name: 'Ana García', email: 'ana@taskflow.dev', color: '#2F6F62' }]

describe('CreateTaskFromTemplateDialog', () => {
  it('no renderiza nada si no hay plantilla seleccionada', () => {
    render(
      <CreateTaskFromTemplateDialog
        template={undefined}
        users={users}
        isSubmitting={false}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('muestra el título de la plantilla seleccionada', () => {
    render(
      <CreateTaskFromTemplateDialog
        template={template}
        users={users}
        isSubmitting={false}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    )

    expect(screen.getByText(/crear tarea desde «revisión semanal»/i)).toBeInTheDocument()
  })

  it('invoca la mutación con el vencimiento y el usuario seleccionados', async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined)
    render(
      <CreateTaskFromTemplateDialog
        template={template}
        users={users}
        isSubmitting={false}
        onConfirm={onConfirm}
        onCancel={vi.fn()}
      />,
    )

    await userEvent.type(screen.getByLabelText(/vencimiento/i), '2026-12-01')
    await userEvent.selectOptions(screen.getByLabelText(/asignada a/i), '7')
    await userEvent.click(screen.getByRole('button', { name: /crear tarea/i }))

    expect(onConfirm).toHaveBeenCalledWith({
      dueDate: new Date('2026-12-01').toISOString(),
      assignedUserId: 7,
    })
  })

  it('invoca la cancelación al pulsar el botón correspondiente', async () => {
    const onCancel = vi.fn()
    render(
      <CreateTaskFromTemplateDialog
        template={template}
        users={users}
        isSubmitting={false}
        onConfirm={vi.fn()}
        onCancel={onCancel}
      />,
    )

    await userEvent.click(screen.getByRole('button', { name: /cancelar/i }))

    expect(onCancel).toHaveBeenCalled()
  })
})
