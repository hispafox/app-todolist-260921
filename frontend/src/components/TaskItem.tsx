import type { Task } from '../types/task'
import type { User } from '../types/user'
import { formatDueDate, isOverdue, priorityLabels } from '../utils/taskMapping'

interface TaskItemProps {
  task: Task
  users?: User[]
  onToggleComplete: (task: Task) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

const priorityPillClass: Record<number, string> = {
  3: 'bg-[#fce4dd] text-[#a33e29]',
  2: 'bg-[#fff0c9] text-amber-dark',
  1: 'bg-[#e0f2ed] text-[#3e7168]',
}

export function TaskItem({ task, users = [], onToggleComplete, onEdit, onDelete }: TaskItemProps) {
  const overdue = isOverdue(task)
  const assignedUser = users.find((user) => user.id === task.assignedUserId)

  return (
    <article
      className="grid grid-cols-[auto_1fr_auto] items-start gap-3.5 rounded-xl border border-line bg-surface p-[18px]"
      style={{ animation: 'appear .3s ease both' }}
    >
      <input
        type="checkbox"
        checked={task.isCompleted}
        onChange={() => onToggleComplete(task)}
        aria-label={task.isCompleted ? `Reabrir ${task.title}` : `Completar ${task.title}`}
        className="mt-0.5 h-[21px] w-[21px] appearance-none rounded-full border-[1.5px] border-[#a8bbb6] bg-white checked:border-teal checked:bg-teal checked:shadow-[inset_0_0_0_4px_#fff]"
      />

      <div className="min-w-0">
        <h3
          className={`mb-1.5 text-[19px] font-medium ${
            task.isCompleted ? 'text-[#5f6d6c] line-through' : ''
          }`}
        >
          {task.title}
        </h3>
        {task.description && (
          <p
            className={`mb-2.5 whitespace-pre-wrap font-sans text-[13px] leading-[1.45] ${
              task.isCompleted ? 'text-[#66746f]' : 'text-muted'
            }`}
          >
            {task.description}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={`inline-flex min-h-6 items-center rounded-[5px] px-2 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.06em] ${priorityPillClass[task.priority]}`}
          >
            {priorityLabels[task.priority]}
          </span>
          {task.category && (
            <span className="inline-flex min-h-6 items-center rounded-[5px] bg-[#edf1ef] px-2 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.06em] text-[#4f5f65]">
              {task.category}
            </span>
          )}
          {task.dueDate && (
            <span
              className={`inline-flex min-h-6 items-center rounded-[5px] px-2 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.06em] ${
                overdue ? 'bg-[#fce4dd] text-[#a33e29]' : 'bg-[#f1f4f2] text-[#5d6a6f]'
              }`}
            >
              {overdue ? 'Vencida · ' : ''}
              {formatDueDate(task.dueDate)}
            </span>
          )}
          {assignedUser && (
            <span className="inline-flex min-h-6 items-center gap-1.5 rounded-[5px] bg-[#edf1ef] px-2 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.06em] text-[#4f5f65]">
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: assignedUser.color }}
              />
              {assignedUser.name}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => onEdit(task)}
          title="Editar tarea"
          aria-label={`Editar ${task.title}`}
          className="h-[31px] w-[31px] rounded-[7px] bg-transparent font-sans text-[18px] text-[#71807f] transition hover:bg-mint hover:text-teal-dark"
        >
          ✎
        </button>
        <button
          type="button"
          onClick={() => onDelete(task)}
          title="Eliminar tarea"
          aria-label={`Eliminar ${task.title}`}
          className="h-[31px] w-[31px] rounded-[7px] bg-transparent font-sans text-[22px] leading-none text-[#71807f] transition hover:bg-[#fce4dd] hover:text-[#a33e29]"
        >
          ×
        </button>
      </div>
    </article>
  )
}
