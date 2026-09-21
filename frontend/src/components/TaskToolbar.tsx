import type { StatusFilter, TaskFilters, TaskPriorityValue } from '../types/task'

interface TaskToolbarProps {
  filters: TaskFilters
  categories: string[]
  onChange: (filters: TaskFilters) => void
}

export function TaskToolbar({ filters, categories, onChange }: TaskToolbarProps) {
  const inputClass =
    'w-full rounded-lg border border-line bg-[#fbfdfc] px-3 py-2.5 text-ink outline-none transition focus:border-teal focus:ring-3 focus:ring-teal/12'

  return (
    <div className="mb-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-[minmax(180px,1.5fr)_repeat(3,minmax(120px,1fr))]">
      <div className="relative sm:col-span-2 lg:col-span-1">
        <span
          aria-hidden
          className="pointer-events-none absolute left-3 top-2 font-serif text-[22px] text-muted"
        >
          ⌕
        </span>
        <input
          type="search"
          value={filters.search}
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
          placeholder="Buscar por título o descripción"
          aria-label="Buscar tareas"
          className={`${inputClass} pl-9`}
        />
      </div>

      <select
        value={filters.status}
        onChange={(event) =>
          onChange({ ...filters, status: event.target.value as StatusFilter })
        }
        aria-label="Filtrar por estado"
        className={inputClass}
      >
        <option value="all">Todos los estados</option>
        <option value="pending">Pendientes</option>
        <option value="completed">Completadas</option>
      </select>

      <select
        value={String(filters.priority)}
        onChange={(event) =>
          onChange({
            ...filters,
            priority:
              event.target.value === 'all'
                ? 'all'
                : (Number(event.target.value) as TaskPriorityValue),
          })
        }
        aria-label="Filtrar por prioridad"
        className={inputClass}
      >
        <option value="all">Todas las prioridades</option>
        <option value="3">Prioridad alta</option>
        <option value="2">Prioridad media</option>
        <option value="1">Prioridad baja</option>
      </select>

      <select
        value={filters.category}
        onChange={(event) => onChange({ ...filters, category: event.target.value })}
        aria-label="Filtrar por categoría"
        className={inputClass}
      >
        <option value="all">Todas las categorías</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  )
}
