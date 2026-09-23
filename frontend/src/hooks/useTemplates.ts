import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  createTaskFromTemplate,
  createTemplate,
  deleteTemplate,
  fetchTemplates,
  updateTemplate,
} from '../api/templatesApi'
import type {
  CreateTaskFromTemplatePayload,
  CreateTaskTemplatePayload,
  UpdateTaskTemplatePayload,
} from '../types/template'

const TEMPLATES_KEY = 'templates'

export function useTemplates() {
  return useQuery({
    queryKey: [TEMPLATES_KEY],
    queryFn: ({ signal }) => fetchTemplates(signal),
  })
}

export function useCreateTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateTaskTemplatePayload) => createTemplate(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [TEMPLATES_KEY] }),
  })
}

export function useUpdateTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateTaskTemplatePayload }) =>
      updateTemplate(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [TEMPLATES_KEY] }),
  })
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteTemplate(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [TEMPLATES_KEY] }),
  })
}

export function useCreateTaskFromTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ templateId, payload }: { templateId: number; payload: CreateTaskFromTemplatePayload }) =>
      createTaskFromTemplate(templateId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  })
}
