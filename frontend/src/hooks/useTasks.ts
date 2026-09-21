import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  completeTask,
  createTask,
  deleteTask,
  fetchTasks,
  reopenTask,
  updateTask,
} from '../api/tasksApi'
import type {
  CreateTaskPayload,
  TaskFilters,
  UpdateTaskPayload,
} from '../types/task'

const TASKS_KEY = 'tasks'

export function useTasks(filters: TaskFilters) {
  return useQuery({
    queryKey: [TASKS_KEY, filters],
    queryFn: ({ signal }) => fetchTasks(filters, signal),
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateTaskPayload) => createTask(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [TASKS_KEY] }),
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateTaskPayload }) =>
      updateTask(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [TASKS_KEY] }),
  })
}

export function useCompleteTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => completeTask(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [TASKS_KEY] }),
  })
}

export function useReopenTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => reopenTask(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [TASKS_KEY] }),
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteTask(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [TASKS_KEY] }),
  })
}
