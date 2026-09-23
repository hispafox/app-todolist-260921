import { useMemo, useState } from 'react'
import { AppHeader } from './components/AppHeader'
import { ConfirmDialog } from './components/ConfirmDialog'
import { CreateTaskFromTemplateDialog } from './components/CreateTaskFromTemplateDialog'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { TaskStats } from './components/TaskStats'
import { TaskToolbar } from './components/TaskToolbar'
import { TemplateManager } from './components/TemplateManager'
import { ToastContainer, useToast } from './components/Toast'
import { UserManager } from './components/UserManager'
import {
  useCompleteTask,
  useCreateTask,
  useDeleteTask,
  useReopenTask,
  useTasks,
  useUpdateTask,
} from './hooks/useTasks'
import {
  useCreateTaskFromTemplate,
  useCreateTemplate,
  useDeleteTemplate,
  useTemplates,
  useUpdateTemplate,
} from './hooks/useTemplates'
import {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
  useUsers,
} from './hooks/useUsers'
import type { TaskFormOutput } from './schemas/taskFormSchema'
import type { Task, TaskFilters } from './types/task'
import type { CreateTaskTemplatePayload, TaskTemplate } from './types/template'
import type { User } from './types/user'
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
  const [userToDelete, setUserToDelete] = useState<User | undefined>(undefined)
  const [templateToDelete, setTemplateToDelete] = useState<TaskTemplate | undefined>(undefined)
  const [templateForNewTask, setTemplateForNewTask] = useState<TaskTemplate | undefined>(undefined)

  const { toasts, showToast } = useToast()
  const tasksQuery = useTasks(filters)
  const createMutation = useCreateTask()
  const updateMutation = useUpdateTask()
  const completeMutation = useCompleteTask()
  const reopenMutation = useReopenTask()
  const deleteMutation = useDeleteTask()

  const usersQuery = useUsers()
  const createUserMutation = useCreateUser()
  const updateUserMutation = useUpdateUser()
  const deleteUserMutation = useDeleteUser()

  const templatesQuery = useTemplates()
  const createTemplateMutation = useCreateTemplate()
  const updateTemplateMutation = useUpdateTemplate()
  const deleteTemplateMutation = useDeleteTemplate()
  const createTaskFromTemplateMutation = useCreateTaskFromTemplate()

  const tasks = useMemo(() => tasksQuery.data ?? [], [tasksQuery.data])
  const users = useMemo(() => usersQuery.data ?? [], [usersQuery.data])
  const templates = useMemo(() => templatesQuery.data ?? [], [templatesQuery.data])


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

  const handleCreateUser = async (values: { name: string; email: string; color: string }) => {
    await createUserMutation.mutateAsync(values)
    showToast('Usuario añadido')
  }

  const handleUpdateUser = async (id: number, values: { name: string; email: string; color: string }) => {
    await updateUserMutation.mutateAsync({ id, payload: values })
    showToast('Usuario actualizado')
  }

  const handleConfirmDeleteUser = async () => {
    if (!userToDelete) {
      return
    }
    try {
      await deleteUserMutation.mutateAsync(userToDelete.id)
      showToast('Usuario eliminado')
    } catch {
      showToast('No se ha podido eliminar el usuario')
    } finally {
      setUserToDelete(undefined)
    }
  }

  const handleCreateTemplate = async (values: CreateTaskTemplatePayload) => {
    await createTemplateMutation.mutateAsync(values)
    showToast('Plantilla añadida')
  }

  const handleUpdateTemplate = async (id: number, values: CreateTaskTemplatePayload) => {
    await updateTemplateMutation.mutateAsync({ id, payload: values })
    showToast('Plantilla actualizada')
  }

  const handleConfirmDeleteTemplate = async () => {
    if (!templateToDelete) {
      return
    }
    try {
      await deleteTemplateMutation.mutateAsync(templateToDelete.id)
      showToast('Plantilla eliminada')
    } catch {
      showToast('No se ha podido eliminar la plantilla')
    } finally {
      setTemplateToDelete(undefined)
    }
  }

  const handleConfirmCreateTaskFromTemplate = async (payload: {
    dueDate: string | null
    assignedUserId: number | null
  }) => {
    if (!templateForNewTask) {
      return
    }
    try {
      await createTaskFromTemplateMutation.mutateAsync({
        templateId: templateForNewTask.id,
        payload,
      })
      showToast('Tarea creada desde la plantilla')
      setTemplateForNewTask(undefined)
    } catch {
      showToast('No se ha podido crear la tarea desde la plantilla')
    }
  }

  return (
    <div className="min-h-screen overflow-hidden">
      <AppHeader />

      <main className="relative mx-auto -mt-[42px] mb-16 max-w-[1200px] px-3 sm:px-5">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(280px,350px)_1fr]">
          <div>
            <TaskForm
              editingTask={editingTask}
              users={users}
              isSubmitting={createMutation.isPending || updateMutation.isPending}
              onSubmit={handleSubmit}
              onCancelEdit={() => setEditingTask(undefined)}
            />
            <UserManager
              users={users}
              isLoading={usersQuery.isLoading}
              onCreate={handleCreateUser}
              onUpdate={handleUpdateUser}
              onDelete={setUserToDelete}
            />
            <TemplateManager
              templates={templates}
              isLoading={templatesQuery.isLoading}
              onCreate={handleCreateTemplate}
              onUpdate={handleUpdateTemplate}
              onDelete={setTemplateToDelete}
              onCreateTaskFromTemplate={setTemplateForNewTask}
            />
          </div>

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
              users={users}
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

      <ConfirmDialog
        open={Boolean(userToDelete)}
        title="Eliminar usuario"
        message={`¿Seguro que quieres eliminar a «${userToDelete?.name ?? ''}»? Las tareas asignadas quedarán sin asignar.`}
        onConfirm={handleConfirmDeleteUser}
        onCancel={() => setUserToDelete(undefined)}
      />

      <ConfirmDialog
        open={Boolean(templateToDelete)}
        title="Eliminar plantilla"
        message={`¿Seguro que quieres eliminar la plantilla «${templateToDelete?.title ?? ''}»? Esta acción no se puede deshacer.`}
        onConfirm={handleConfirmDeleteTemplate}
        onCancel={() => setTemplateToDelete(undefined)}
      />

      <CreateTaskFromTemplateDialog
        template={templateForNewTask}
        users={users}
        isSubmitting={createTaskFromTemplateMutation.isPending}
        onConfirm={handleConfirmCreateTaskFromTemplate}
        onCancel={() => setTemplateForNewTask(undefined)}
      />

      <ToastContainer toasts={toasts} />
    </div>
  )
}

export default App
