import { useState, type FormEvent } from 'react'
import type { User } from '../types/user'

interface UserManagerProps {
  users: User[]
  isLoading: boolean
  onCreate: (values: { name: string; email: string; color: string }) => Promise<void>
  onUpdate: (id: number, values: { name: string; email: string; color: string }) => Promise<void>
  onDelete: (user: User) => void
}

const DEFAULT_COLOR = '#2F6F62'

export function UserManager({ users, isLoading, onCreate, onUpdate, onDelete }: UserManagerProps) {
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [color, setColor] = useState(DEFAULT_COLOR)
  const [error, setError] = useState<string | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const inputClass =
    'w-full rounded-lg border border-line bg-[#fbfdfc] px-3 py-2 text-[13px] text-ink outline-none transition focus:border-teal focus:ring-3 focus:ring-teal/12'
  const labelClass =
    'mb-1 block font-sans text-[11px] font-bold uppercase tracking-[0.08em] text-[#526268]'

  const resetForm = () => {
    setEditingUser(undefined)
    setName('')
    setEmail('')
    setColor(DEFAULT_COLOR)
    setError(undefined)
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setName(user.name)
    setEmail(user.email)
    setColor(user.color)
    setError(undefined)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim() || !email.trim()) {
      setError('El nombre y el email son obligatorios.')
      return
    }

    setIsSubmitting(true)
    setError(undefined)
    try {
      const values = { name: name.trim(), email: email.trim(), color }
      if (editingUser) {
        await onUpdate(editingUser.id, values)
      } else {
        await onCreate(values)
      }
      resetForm()
    } catch {
      setError('No se ha podido guardar el usuario. Comprueba que el email no esté repetido.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-5 rounded-2xl border border-line/80 bg-surface p-6 shadow-panel">
      <div className="mb-4">
        <div className="font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-teal">
          Equipo
        </div>
        <h2 className="m-0 text-[19px] font-medium tracking-[-0.02em]">Usuarios asignables</h2>
      </div>

      {isLoading ? (
        <p className="mb-4 font-sans text-[13px] text-muted">Cargando usuarios...</p>
      ) : users.length === 0 ? (
        <p className="mb-4 font-sans text-[13px] text-muted">
          Todavía no hay usuarios. Añade el primero para poder asignar tareas.
        </p>
      ) : (
        <ul className="mb-4 grid gap-2">
          {users.map((user) => (
            <li
              key={user.id}
              className="flex items-center justify-between gap-2 rounded-lg border border-line bg-[#fbfdfc] px-3 py-2"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span
                  aria-hidden
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: user.color }}
                />
                <div className="min-w-0">
                  <p className="truncate font-sans text-[13px] font-semibold text-ink">{user.name}</p>
                  <p className="truncate font-sans text-[11px] text-muted">{user.email}</p>
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => handleEdit(user)}
                  title="Editar usuario"
                  aria-label={`Editar ${user.name}`}
                  className="h-[26px] w-[26px] rounded-md bg-transparent text-[14px] text-[#71807f] transition hover:bg-mint hover:text-teal-dark"
                >
                  ✎
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(user)}
                  title="Eliminar usuario"
                  aria-label={`Eliminar ${user.name}`}
                  className="h-[26px] w-[26px] rounded-md bg-transparent text-[16px] leading-none text-[#71807f] transition hover:bg-[#fce4dd] hover:text-[#a33e29]"
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="grid gap-2.5" aria-label="Formulario de usuario">
        <div>
          <label htmlFor="user-name" className={labelClass}>
            Nombre
          </label>
          <input
            id="user-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={80}
            placeholder="Nombre de la persona"
            className={inputClass}
          />
        </div>
        <div className="grid grid-cols-[1fr_auto] gap-2.5">
          <div>
            <label htmlFor="user-email" className={labelClass}>
              Email
            </label>
            <input
              id="user-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              maxLength={200}
              placeholder="persona@empresa.com"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="user-color" className={labelClass}>
              Color
            </label>
            <input
              id="user-color"
              type="color"
              value={color}
              onChange={(event) => setColor(event.target.value)}
              aria-label="Color identificativo"
              className="h-[38px] w-[46px] cursor-pointer rounded-lg border border-line bg-[#fbfdfc] p-1"
            />
          </div>
        </div>
        {error && <p className="font-sans text-[12px] text-coral">{error}</p>}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 rounded-lg bg-teal px-4 py-2 font-sans text-[13px] font-bold text-white transition hover:-translate-y-px hover:bg-teal-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {editingUser ? 'Guardar usuario' : 'Añadir usuario'}
          </button>
          {editingUser && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg bg-mint px-4 py-2 font-sans text-[13px] font-bold text-teal-dark transition hover:-translate-y-px"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
