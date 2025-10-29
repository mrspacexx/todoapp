import { z } from 'zod'

export const todoStatusSchema = z.enum(['todo', 'in_progress', 'done'])
export const todoPrioritySchema = z.enum(['low', 'medium', 'high'])

export const createTodoSchema = z.object({
  title: z.string().min(1, 'Başlık gereklidir').max(255, 'Başlık çok uzun'),
  description: z.string().optional(),
  priority: todoPrioritySchema,
  dueDate: z.string().optional(),
  tags: z.array(z.number()).optional(),
})

export const updateTodoSchema = z.object({
  title: z.string().min(1, 'Başlık gereklidir').max(255, 'Başlık çok uzun').optional(),
  description: z.string().optional(),
  status: todoStatusSchema.optional(),
  priority: todoPrioritySchema.optional(),
  dueDate: z.string().optional(),
  tags: z.array(z.number()).optional(),
})

export const todoFiltersSchema = z.object({
  status: z.array(todoStatusSchema).optional(),
  priority: z.array(todoPrioritySchema).optional(),
  search: z.string().optional(),
  sort: z.string().optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  tags: z.array(z.number()).optional(),
})

export type CreateTodoInput = z.infer<typeof createTodoSchema>
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>
export type TodoFiltersInput = z.infer<typeof todoFiltersSchema>
