import { useState, type FormEvent } from 'react'
import { templateFormSchema } from '../schemas/templateFormSchema'
import { priorityLabels } from '../utils/taskMapping'
import { TaskPriority, type TaskPriorityValue } from '../types/task'
import type { CreateTaskTemplatePayload, TaskTemplate } from '../types/template'

interface TemplateManagerProps {
  templates: TaskTemplate[]
  isLoading: boolean
  onCreate: (values: CreateTaskTemplatePayload) => Promise<void>
  onUpdate: (id: number, values: CreateTaskTemplatePayload) => Promise<void>
  onDelete: (template: TaskTemplate) => void
  onCreateTaskFromTemplate: (template: TaskTemplate) => void
}

export function TemplateManager({
  templates,
  isLoading,
  onCreate,
  onUpdate,
  onDelete,
  onCreateTaskFromTemplate,
}: TemplateManagerProps) {
  const [editingTemplate, setEditingTemplate] = useState<TaskTemplate | undefined>(undefined)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TaskPriorityValue>(TaskPriority.Medium)
  const [category, setCategory] = useState('')
  const [error, setError] = useState<string | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const inputClass =
    'w-full rounded-lg border border-line bg-[#fbfdfc] px-3 py-2 text-[13px] text-ink outline-none transition focus:border-teal focus:ring-3 focus:ring-teal/12'
  const labelClass =
    'mb-1 block font-sans text-[11px] font-bold uppercase tracking-[0.08em] text-[#526268]'

  const resetForm = () => {
    setEditingTemplate(undefined)
    setTitle('')
    setDescription('')
    setPriority(TaskPriority.Medium)
    setCategory('')
    setError(undefined)
  }

  const handleEdit = (template: TaskTemplate) => {
    setEditingTemplate(template)
    setTitle(template.title)
    setDescription(template.description ?? '')
    setPriority(template.priority)
    setCategory(template.category ?? '')
    setError(undefined)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    const parsed = templateFormSchema.safeParse({ title, description, priority, category })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Revisa los datos de la plantilla.')
      return
    }

    setIsSubmitting(true)
    setError(undefined)
    try {
      const values: CreateTaskTemplatePayload = {
        title: parsed.data.title,
        description: parsed.data.description?.trim() ? parsed.data.description.trim() : null,
        priority: parsed.data.priority as TaskPriorityValue,
        category: parsed.data.category?.trim() ? parsed.data.category.trim() : null,
      }
      if (editingTemplate) {
        await onUpdate(editingTemplate.id, values)
      } else {
        await onCreate(values)
      }
      resetForm()
    } catch {
      setError('No se ha podido guardar la plantilla.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-5 rounded-2xl border border-line/80 bg-surface p-6 shadow-panel">
      <div className="mb-4">
        <div className="font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-teal">
          Reutilizables
        </div>
        <h2 className="m-0 text-[19px] font-medium tracking-[-0.02em]">Plantillas de tareas</h2>
      </div>

      {isLoading ? (
        <p className="mb-4 font-sans text-[13px] text-muted">Cargando plantillas...</p>
      ) : templates.length === 0 ? (
        <p className="mb-4 font-sans text-[13px] text-muted">
          Todavía no hay plantillas. Crea la primera para reutilizarla al crear tareas.
        </p>
      ) : (
        <ul className="mb-4 grid gap-2">
          {templates.map((template) => (
            <li
              key={template.id}
              className="flex items-center justify-between gap-2 rounded-lg border border-line bg-[#fbfdfc] px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate font-sans text-[13px] font-semibold text-ink">{template.title}</p>
                <p className="truncate font-sans text-[11px] text-muted">
                  {priorityLabels[template.priority]}
                  {template.category ? ` · ${template.category}` : ''}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => onCreateTaskFromTemplate(template)}
                  title="Crear tarea desde esta plantilla"
                  aria-label={`Crear tarea desde ${template.title}`}
                  className="h-[26px] w-[26px] rounded-md bg-transparent text-[14px] text-[#71807f] transition hover:bg-mint hover:text-teal-dark"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => handleEdit(template)}
                  title="Editar plantilla"
                  aria-label={`Editar ${template.title}`}
                  className="h-[26px] w-[26px] rounded-md bg-transparent text-[14px] text-[#71807f] transition hover:bg-mint hover:text-teal-dark"
                >
                  ✎
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(template)}
                  title="Eliminar plantilla"
                  aria-label={`Eliminar ${template.title}`}
                  className="h-[26px] w-[26px] rounded-md bg-transparent text-[16px] leading-none text-[#71807f] transition hover:bg-[#fce4dd] hover:text-[#a33e29]"
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="grid gap-2.5" aria-label="Formulario de plantilla">
        <div>
          <label htmlFor="template-title" className={labelClass}>
            Título
          </label>
          <input
            id="template-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={120}
            placeholder="Título reutilizable"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="template-description" className={labelClass}>
            Descripción
          </label>
          <textarea
            id="template-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={500}
            placeholder="Descripción reutilizable"
            className={`${inputClass} min-h-[70px] resize-y`}
          />
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label htmlFor="template-priority" className={labelClass}>
              Prioridad
            </label>
            <select
              id="template-priority"
              value={priority}
              onChange={(event) => setPriority(Number(event.target.value) as TaskPriorityValue)}
              className={inputClass}
            >
              <option value={TaskPriority.High}>Alta</option>
              <option value={TaskPriority.Medium}>Media</option>
              <option value={TaskPriority.Low}>Baja</option>
            </select>
          </div>
          <div>
            <label htmlFor="template-category" className={labelClass}>
              Categoría
            </label>
            <input
              id="template-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              maxLength={40}
              placeholder="Ej. Personal, Trabajo"
              className={inputClass}
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
            {editingTemplate ? 'Guardar plantilla' : 'Añadir plantilla'}
          </button>
          {editingTemplate && (
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
