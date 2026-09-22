import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  taskFormSchema,
  type TaskFormOutput,
  type TaskFormValues,
} from '../schemas/taskFormSchema'
import type { Task } from '../types/task'
import type { User } from '../types/user'
import { taskToFormDefaults } from '../utils/taskMapping'

interface TaskFormProps {
  editingTask?: Task
  users?: User[]
  isSubmitting: boolean
  onSubmit: (values: TaskFormOutput) => Promise<void> | void
  onCancelEdit: () => void
}

export function TaskForm({
  editingTask,
  users = [],
  isSubmitting,
  onSubmit,
  onCancelEdit,
}: TaskFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues, unknown, TaskFormOutput>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: taskToFormDefaults(editingTask),
  })

  useEffect(() => {
    reset(taskToFormDefaults(editingTask))
  }, [editingTask, reset])

  const submit = handleSubmit(async (values) => {
    await onSubmit(values)
    if (!editingTask) {
      reset(taskToFormDefaults())
    }
  })

  const isEditing = Boolean(editingTask)
  const labelClass =
    'mb-1.5 block font-sans text-[11px] font-bold uppercase tracking-[0.08em] text-[#526268]'
  const inputClass =
    'w-full rounded-lg border border-line bg-[#fbfdfc] px-3 py-2.5 text-ink outline-none transition focus:border-teal focus:ring-3 focus:ring-teal/12'
  const errorClass = 'mt-1 font-sans text-[12px] text-coral'

  return (
    <aside className="rounded-2xl border border-line/80 bg-surface p-6 shadow-panel">
      <div className="mb-5">
        <div className="font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-teal">
          {isEditing ? 'Editar tarea' : 'Nueva tarea'}
        </div>
        <h2 className="m-0 text-[22px] font-medium tracking-[-0.02em]">
          {isEditing ? 'Actualiza los detalles' : 'Añade algo pendiente'}
        </h2>
      </div>

      <form onSubmit={submit} noValidate>
        <div className="mb-4">
          <label htmlFor="title" className={labelClass}>
            Título *
          </label>
          <input
            id="title"
            {...register('title')}
            maxLength={120}
            placeholder="¿Qué necesitas hacer?"
            aria-invalid={Boolean(errors.title)}
            className={inputClass}
          />
          {errors.title && <p className={errorClass}>{errors.title.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="description" className={labelClass}>
            Descripción
          </label>
          <textarea
            id="description"
            {...register('description')}
            maxLength={500}
            placeholder="Añade contexto o próximos pasos..."
            aria-invalid={Boolean(errors.description)}
            className={`${inputClass} min-h-[92px] resize-y`}
          />
          {errors.description && (
            <p className={errorClass}>{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="mb-4">
            <label htmlFor="priority" className={labelClass}>
              Prioridad
            </label>
            <select id="priority" {...register('priority')} className={inputClass}>
              <option value="3">Alta</option>
              <option value="2">Media</option>
              <option value="1">Baja</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="dueDate" className={labelClass}>
              Vencimiento
            </label>
            <input
              id="dueDate"
              type="date"
              {...register('dueDate')}
              className={inputClass}
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="category" className={labelClass}>
            Categoría
          </label>
          <input
            id="category"
            {...register('category')}
            maxLength={40}
            placeholder="Ej. Personal, Trabajo"
            aria-invalid={Boolean(errors.category)}
            className={inputClass}
          />
          {errors.category && <p className={errorClass}>{errors.category.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="assignedUserId" className={labelClass}>
            Asignada a
          </label>
          <select id="assignedUserId" {...register('assignedUserId')} className={inputClass}>
            <option value="">Sin asignar</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-5 flex gap-2.5">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 rounded-lg bg-teal px-4 py-2.5 font-sans text-[13px] font-bold text-white transition hover:-translate-y-px hover:bg-teal-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isEditing ? 'Guardar cambios' : 'Crear tarea'}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="rounded-lg bg-mint px-4 py-2.5 font-sans text-[13px] font-bold text-teal-dark transition hover:-translate-y-px"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </aside>
  )
}
