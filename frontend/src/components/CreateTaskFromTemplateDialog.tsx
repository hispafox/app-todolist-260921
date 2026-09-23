import { useEffect, useState } from 'react'
import type { CreateTaskFromTemplatePayload, TaskTemplate } from '../types/template'
import type { User } from '../types/user'

interface CreateTaskFromTemplateDialogProps {
  template: TaskTemplate | undefined
  users: User[]
  isSubmitting: boolean
  onConfirm: (payload: CreateTaskFromTemplatePayload) => Promise<void>
  onCancel: () => void
}

export function CreateTaskFromTemplateDialog({
  template,
  users,
  isSubmitting,
  onConfirm,
  onCancel,
}: CreateTaskFromTemplateDialogProps) {
  const [dueDate, setDueDate] = useState('')
  const [assignedUserId, setAssignedUserId] = useState('')

  useEffect(() => {
    if (template) {
      setDueDate('')
      setAssignedUserId('')
    }
  }, [template])

  useEffect(() => {
    if (!template) {
      return
    }
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [template, onCancel])

  if (!template) {
    return null
  }

  const inputClass =
    'w-full rounded-lg border border-line bg-[#fbfdfc] px-3 py-2 text-[13px] text-ink outline-none transition focus:border-teal focus:ring-3 focus:ring-teal/12'
  const labelClass =
    'mb-1 block font-sans text-[11px] font-bold uppercase tracking-[0.08em] text-[#526268]'

  const handleConfirm = async () => {
    await onConfirm({
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      assignedUserId: assignedUserId ? Number(assignedUserId) : null,
    })
  }

  return (
    <div
      className="fixed inset-0 z-30 grid place-items-center bg-black/35 p-4"
      role="presentation"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-from-template-title"
        className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-panel"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="create-from-template-title" className="m-0 mb-2 text-xl font-medium">
          Crear tarea desde «{template.title}»
        </h2>
        <p className="mb-5 font-sans text-[14px] text-muted">
          Indica el vencimiento y la persona asignada para la nueva tarea.
        </p>

        <div className="mb-4">
          <label htmlFor="from-template-due-date" className={labelClass}>
            Vencimiento
          </label>
          <input
            id="from-template-due-date"
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            className={inputClass}
          />
        </div>

        <div className="mb-5">
          <label htmlFor="from-template-user" className={labelClass}>
            Asignada a
          </label>
          <select
            id="from-template-user"
            value={assignedUserId}
            onChange={(event) => setAssignedUserId(event.target.value)}
            className={inputClass}
          >
            <option value="">Sin asignar</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg bg-mint px-4 py-2.5 font-sans text-[13px] font-bold text-teal-dark transition hover:-translate-y-px"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="rounded-lg bg-teal px-4 py-2.5 font-sans text-[13px] font-bold text-white transition hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
          >
            Crear tarea
          </button>
        </div>
      </div>
    </div>
  )
}
