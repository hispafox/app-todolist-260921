import { useMemo, useState } from 'react'
import { AppHeader } from './components/AppHeader'
import { ConfirmDialog } from './components/ConfirmDialog'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { TaskStats } from './components/TaskStats'
import { TaskToolbar } from './components/TaskToolbar'
import { ToastContainer, useToast } from './components/Toast'
import {
  useCompleteTask,
  useCreateTask,
  useDeleteTask,
  useReopenTask,
  useTasks,
  useUpdateTask,
} from './hooks/useTasks'
import type { TaskFormOutput } from './schemas/taskFormSchema'
import type { Task, TaskFilters } from './types/task'
import { formToPayload } from './utils/taskMapping'

const initialFilters: TaskFilters = {
  search: '',
  status: 'all',
  priority: 'all',
  category: 'all',
}

function App() {
  const [filters, setFilters] = useState<TaskFilters>(initialFilters)
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined)
  const [taskToDelete, setTaskToDelete] = useState<Task | undefined>(undefined)

  const { toasts, showToast } = useToast()
  const tasksQuery = useTasks(filters)
  const createMutation = useCreateTask()
  const updateMutation = useUpdateTask()
  const completeMutation = useCompleteTask()
  const reopenMutation = useReopenTask()
  const deleteMutation = useDeleteTask()

  const tasks = useMemo(() => tasksQuery.data ?? [], [tasksQuery.data])

  const counts = useMemo(() => {
    const completed = tasks.filter((task) => task.isCompleted).length
    return {
      total: tasks.length,
      completed,
      pending: tasks.length - completed,
    }
  }, [tasks])

  const categories = useMemo(() => {
    const unique = new Set<string>()
    for (const task of tasks) {
      if (task.category) {
        unique.add(task.category)
      }
    }
    return [...unique].sort((a, b) => a.localeCompare(b, 'es'))
  }, [tasks])

  const hasActiveFilters =
    filters.search.trim() !== '' ||
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.category !== 'all'

  const handleSubmit = async (values: TaskFormOutput) => {
    const payload = formToPayload(values)
    try {
      if (editingTask) {
        await updateMutation.mutateAsync({ id: editingTask.id, payload })
        showToast('Tarea actualizada')
        setEditingTask(undefined)
      } else {
        await createMutation.mutateAsync(payload)
        showToast('Tarea creada')
      }
    } catch {
      showToast('No se ha podido guardar la tarea')
    }
  }

  const handleToggleComplete = async (task: Task) => {
    try {
      if (task.isCompleted) {
        await reopenMutation.mutateAsync(task.id)
        showToast('Tarea reabierta')
      } else {
        await completeMutation.mutateAsync(task.id)
        showToast('Tarea completada')
      }
    } catch {
      showToast('No se ha podido actualizar la tarea')
    }
  }

  const handleConfirmDelete = async () => {
    if (!taskToDelete) {
      return
    }
    try {
      await deleteMutation.mutateAsync(taskToDelete.id)
      showToast('Tarea eliminada')
      if (editingTask?.id === taskToDelete.id) {
        setEditingTask(undefined)
      }
    } catch {
      showToast('No se ha podido eliminar la tarea')
    } finally {
      setTaskToDelete(undefined)
    }
  }

  return (
    <div className="min-h-screen overflow-hidden">
      <AppHeader />

      <main className="relative mx-auto -mt-[42px] mb-16 max-w-[1200px] px-3 sm:px-5">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(280px,350px)_1fr]">
          <TaskForm
            editingTask={editingTask}
            isSubmitting={createMutation.isPending || updateMutation.isPending}
            onSubmit={handleSubmit}
            onCancelEdit={() => setEditingTask(undefined)}
          />

          <section className="min-w-0">
            <TaskStats
              total={counts.total}
              pending={counts.pending}
              completed={counts.completed}
            />
            <TaskToolbar
              filters={filters}
              categories={categories}
              onChange={setFilters}
            />
            <TaskList
              tasks={tasks}
              isLoading={tasksQuery.isLoading}
              isError={tasksQuery.isError}
              hasActiveFilters={hasActiveFilters}
              onRetry={() => tasksQuery.refetch()}
              onToggleComplete={handleToggleComplete}
              onEdit={setEditingTask}
              onDelete={setTaskToDelete}
            />
          </section>
        </div>
      </main>

      <ConfirmDialog
        open={Boolean(taskToDelete)}
        title="Eliminar tarea"
        message={`¿Seguro que quieres eliminar «${taskToDelete?.title ?? ''}»? Esta acción no se puede deshacer.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setTaskToDelete(undefined)}
      />

      <ToastContainer toasts={toasts} />
    </div>
  )
}

export default App
