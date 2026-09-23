import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { TemplateManager } from '../components/TemplateManager'
import type { TaskTemplate } from '../types/template'

const templates: TaskTemplate[] = [
  { id: 1, title: 'Revisión semanal', description: null, priority: 3, category: 'Trabajo' },
]

describe('TemplateManager', () => {
  it('muestra el estado vacío cuando no hay plantillas', () => {
    render(
      <TemplateManager
        templates={[]}
        isLoading={false}
        onCreate={vi.fn()}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
        onCreateTaskFromTemplate={vi.fn()}
      />,
    )

    expect(screen.getByText(/todavía no hay plantillas/i)).toBeInTheDocument()
  })

  it('lista las plantillas recibidas', () => {
    render(
      <TemplateManager
        templates={templates}
        isLoading={false}
        onCreate={vi.fn()}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
        onCreateTaskFromTemplate={vi.fn()}
      />,
    )

    expect(screen.getByText('Revisión semanal')).toBeInTheDocument()
    expect(screen.getByText(/Alta · Trabajo/i)).toBeInTheDocument()
  })

  it('valida que el título sea obligatorio antes de enviar', async () => {
    const onCreate = vi.fn()
    render(
      <TemplateManager
        templates={[]}
        isLoading={false}
        onCreate={onCreate}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
        onCreateTaskFromTemplate={vi.fn()}
      />,
    )

    await userEvent.click(screen.getByRole('button', { name: /añadir plantilla/i }))

    expect(await screen.findByText(/el título es obligatorio/i)).toBeInTheDocument()
    expect(onCreate).not.toHaveBeenCalled()
  })

  it('envía los datos de la nueva plantilla', async () => {
    const onCreate = vi.fn().mockResolvedValue(undefined)
    render(
      <TemplateManager
        templates={[]}
        isLoading={false}
        onCreate={onCreate}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
        onCreateTaskFromTemplate={vi.fn()}
      />,
    )

    await userEvent.type(screen.getByLabelText(/título/i), 'Revisión mensual')
    await userEvent.click(screen.getByRole('button', { name: /añadir plantilla/i }))

    expect(onCreate).toHaveBeenCalledWith({
      title: 'Revisión mensual',
      description: null,
      priority: 2,
      category: null,
    })
  })

  it('invoca la eliminación al pulsar el botón correspondiente', async () => {
    const onDelete = vi.fn()
    render(
      <TemplateManager
        templates={templates}
        isLoading={false}
        onCreate={vi.fn()}
        onUpdate={vi.fn()}
        onDelete={onDelete}
        onCreateTaskFromTemplate={vi.fn()}
      />,
    )

    await userEvent.click(screen.getByRole('button', { name: /eliminar revisión semanal/i }))

    expect(onDelete).toHaveBeenCalledWith(templates[0])
  })

  it('invoca la creación de tarea desde plantilla al pulsar el botón correspondiente', async () => {
    const onCreateTaskFromTemplate = vi.fn()
    render(
      <TemplateManager
        templates={templates}
        isLoading={false}
        onCreate={vi.fn()}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
        onCreateTaskFromTemplate={onCreateTaskFromTemplate}
      />,
    )

    await userEvent.click(screen.getByRole('button', { name: /crear tarea desde revisión semanal/i }))

    expect(onCreateTaskFromTemplate).toHaveBeenCalledWith(templates[0])
  })
})
