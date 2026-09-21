import type { Task } from '../types/task'
import { TaskItem } from './TaskItem'

interface TaskListProps {
  tasks: Task[]
  isLoading: boolean
  isError: boolean
  hasActiveFilters: boolean
  onRetry: () => void
  onToggleComplete: (task: Task) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

export function TaskList({
  tasks,
  isLoading,
  isError,
  hasActiveFilters,
  onRetry,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskListProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-dashed border-[#c9d7d2] p-14 text-center text-muted">
        Cargando tareas...
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-dashed border-coral/60 bg-[#fdeeea] p-14 text-center">
        <strong className="mb-1.5 block text-[21px] font-medium text-ink">
          No se han podido cargar las tareas
        </strong>
        <p className="mb-4 font-sans text-[13px] text-muted">
          Comprueba que la API está en marcha e inténtalo de nuevo.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg bg-teal px-4 py-2.5 font-sans text-[13px] font-bold text-white transition hover:bg-teal-dark"
        >
          Reintentar
        </button>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#c9d7d2] p-14 text-center text-muted">
        <strong className="mb-1.5 block text-[21px] font-medium text-ink">
          {hasActiveFilters ? 'No hay coincidencias' : 'Tu lista está despejada'}
        </strong>
        <p className="font-sans text-[13px]">
          {hasActiveFilters
            ? 'Prueba a cambiar los filtros o la búsqueda.'
            : 'Crea tu primera tarea para empezar a organizarte.'}
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
