export type TodoStatus = 'todo' | 'in_progress' | 'done'
export type TodoPriority = 'low' | 'medium' | 'high'

export interface Tag {
  id: number
  name: string
  color: string
  createdAt: string
  updatedAt: string
}

export interface Todo {
  id: number
  title: string
  description?: string
  status: TodoStatus
  priority: TodoPriority
  dueDate?: string
  createdAt: string
  updatedAt: string
  tags: Tag[]
}

export interface CreateTodoRequest {
  title: string
  description?: string
  priority: TodoPriority
  dueDate?: string
  tags?: number[]
}

export interface UpdateTodoRequest {
  title?: string
  description?: string
  status?: TodoStatus
  priority?: TodoPriority
  dueDate?: string
  tags?: number[]
}

export interface TodoFilters {
  status?: TodoStatus[]
  priority?: TodoPriority[]
  search?: string
  sort?: string
  page?: number
  limit?: number
  tags?: number[]
}

export interface TodoResponse {
  data: Todo[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}
