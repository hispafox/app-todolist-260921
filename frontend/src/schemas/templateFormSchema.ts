import { z } from 'zod'
import { TaskPriority } from '../types/task'

export const templateFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'El título es obligatorio.')
    .max(120, 'El título no puede superar los 120 caracteres.'),
  description: z
    .string()
    .trim()
    .max(500, 'La descripción no puede superar los 500 caracteres.')
    .optional(),
  priority: z.coerce
    .number()
    .refine(
      (value) => value === TaskPriority.Low || value === TaskPriority.Medium || value === TaskPriority.High,
      'Selecciona una prioridad válida.',
    ),
  category: z
    .string()
    .trim()
    .max(40, 'La categoría no puede superar los 40 caracteres.')
    .optional(),
})

export type TemplateFormValues = z.input<typeof templateFormSchema>
export type TemplateFormOutput = z.output<typeof templateFormSchema>
