import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { UserManager } from '../components/UserManager'
import type { User } from '../types/user'

const users: User[] = [{ id: 1, name: 'Ana García', email: 'ana@taskflow.dev', color: '#2F6F62' }]

describe('UserManager', () => {
  it('muestra el estado vacío cuando no hay usuarios', () => {
    render(
      <UserManager users={[]} isLoading={false} onCreate={vi.fn()} onUpdate={vi.fn()} onDelete={vi.fn()} />,
    )

    expect(screen.getByText(/todavía no hay usuarios/i)).toBeInTheDocument()
  })

  it('lista los usuarios recibidos', () => {
    render(
      <UserManager users={users} isLoading={false} onCreate={vi.fn()} onUpdate={vi.fn()} onDelete={vi.fn()} />,
    )

    expect(screen.getByText('Ana García')).toBeInTheDocument()
    expect(screen.getByText('ana@taskflow.dev')).toBeInTheDocument()
  })

  it('valida que nombre y email sean obligatorios antes de enviar', async () => {
    const onCreate = vi.fn()
    render(
      <UserManager users={[]} isLoading={false} onCreate={onCreate} onUpdate={vi.fn()} onDelete={vi.fn()} />,
    )

    await userEvent.click(screen.getByRole('button', { name: /añadir usuario/i }))

    expect(await screen.findByText(/son obligatorios/i)).toBeInTheDocument()
    expect(onCreate).not.toHaveBeenCalled()
  })

  it('envía los datos del nuevo usuario', async () => {
    const onCreate = vi.fn().mockResolvedValue(undefined)
    render(
      <UserManager users={[]} isLoading={false} onCreate={onCreate} onUpdate={vi.fn()} onDelete={vi.fn()} />,
    )

    await userEvent.type(screen.getByLabelText(/nombre/i), 'Carlos Pérez')
    await userEvent.type(screen.getByLabelText(/^email$/i), 'carlos@taskflow.dev')
    await userEvent.click(screen.getByRole('button', { name: /añadir usuario/i }))

    expect(onCreate).toHaveBeenCalledWith({
      name: 'Carlos Pérez',
      email: 'carlos@taskflow.dev',
      color: '#2F6F62',
    })
  })

  it('invoca la eliminación al pulsar el botón correspondiente', async () => {
    const onDelete = vi.fn()
    render(
      <UserManager users={users} isLoading={false} onCreate={vi.fn()} onUpdate={vi.fn()} onDelete={onDelete} />,
    )

    await userEvent.click(screen.getByRole('button', { name: /eliminar ana garcía/i }))

    expect(onDelete).toHaveBeenCalledWith(users[0])
  })
})
