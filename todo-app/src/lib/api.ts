import axios, { AxiosError } from 'axios'
import { Todo, CreateTodoRequest, UpdateTodoRequest, TodoFilters, TodoResponse, ApiError, Tag } from '@/types/todo'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError<ApiError>) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const todoApi = {
  // Get all todos with filters
  async getTodos(filters: TodoFilters = {}): Promise<TodoResponse> {
    const params = new URLSearchParams()
    
    if (filters.status?.length) {
      params.append('status', filters.status.join(','))
    }
    if (filters.priority?.length) {
      params.append('priority', filters.priority.join(','))
    }
    if (filters.search) {
      params.append('search', filters.search)
    }
    if (filters.sort) {
      params.append('sort', filters.sort)
    }
    if (filters.page) {
      params.append('page', filters.page.toString())
    }
    if (filters.limit) {
      params.append('limit', filters.limit.toString())
    }
    if (filters.tags?.length) {
      params.append('tags', filters.tags.join(','))
    }

    const response = await api.get(`/todos?${params.toString()}`)
    
    // Convert snake_case to camelCase for frontend
    const convertedData = {
      ...response.data,
      data: response.data.data?.map((todo: any) => ({
        ...todo,
        dueDate: todo.dueDate,
        createdAt: todo.created_at,
        updatedAt: todo.updated_at,
        tags: todo.tags?.map((tag: any) => ({
          ...tag,
          createdAt: tag.created_at,
          updatedAt: tag.updated_at,
        })) || []
      })) || []
    }
    
    return convertedData
  },

  // Get single todo
  async getTodo(id: number): Promise<Todo> {
    const response = await api.get(`/todos/${id}`)
    
    // Convert snake_case to camelCase for frontend
    const responseTodo = response.data
    return {
      ...responseTodo,
      dueDate: responseTodo.dueDate,
      createdAt: responseTodo.created_at,
      updatedAt: responseTodo.updated_at,
      tags: responseTodo.tags?.map((tag: any) => ({
        ...tag,
        createdAt: tag.created_at,
        updatedAt: tag.updated_at,
      })) || []
    }
  },

  // Create todo
  async createTodo(todo: CreateTodoRequest): Promise<Todo> {
    // Convert camelCase to snake_case for backend
    const backendTodo = {
      title: todo.title,
      description: todo.description,
      priority: todo.priority,
      dueDate: todo.dueDate,
      tags: todo.tags,
    }
    const response = await api.post('/todos', backendTodo)
    
    // Convert snake_case to camelCase for frontend
    const responseTodo = response.data
    return {
      ...responseTodo,
      dueDate: responseTodo.dueDate,
      createdAt: responseTodo.created_at,
      updatedAt: responseTodo.updated_at,
      tags: responseTodo.tags?.map((tag: any) => ({
        ...tag,
        createdAt: tag.created_at,
        updatedAt: tag.updated_at,
      })) || []
    }
  },

  // Update todo
  async updateTodo(id: number, todo: UpdateTodoRequest): Promise<Todo> {
    // Convert camelCase to snake_case for backend
    const backendTodo = {
      title: todo.title,
      description: todo.description,
      status: todo.status,
      priority: todo.priority,
      dueDate: todo.dueDate,
      tags: todo.tags,
    }
    // Remove undefined values
    Object.keys(backendTodo).forEach(key => 
      (backendTodo as any)[key] === undefined && delete (backendTodo as any)[key]
    )
    const response = await api.patch(`/todos/${id}`, backendTodo)
    
    // Convert snake_case to camelCase for frontend
    const responseTodo = response.data
    return {
      ...responseTodo,
      dueDate: responseTodo.dueDate,
      createdAt: responseTodo.created_at,
      updatedAt: responseTodo.updated_at,
      tags: responseTodo.tags?.map((tag: any) => ({
        ...tag,
        createdAt: tag.created_at,
        updatedAt: tag.updated_at,
      })) || []
    }
  },

  // Delete todo
  async deleteTodo(id: number): Promise<void> {
    await api.delete(`/todos/${id}`)
  },

  // Tag operations
  async getTags(): Promise<Tag[]> {
    const response = await api.get('/tags')
    return response.data.map((tag: any) => ({
      ...tag,
      createdAt: tag.created_at,
      updatedAt: tag.updated_at,
    }))
  },

  async createTag(name: string, color: string = '#3B82F6'): Promise<Tag> {
    const response = await api.post('/tags', { name, color })
    return {
      ...response.data,
      createdAt: response.data.created_at,
      updatedAt: response.data.updated_at,
    }
  },

  async updateTag(id: number, name: string, color: string): Promise<Tag> {
    const response = await api.patch(`/tags/${id}`, { name, color })
    return {
      ...response.data,
      createdAt: response.data.created_at,
      updatedAt: response.data.updated_at,
    }
  },

  async deleteTag(id: number): Promise<void> {
    await api.delete(`/tags/${id}`)
  },

  // Bulk operations
  async bulkDeleteTodos(ids: number[]): Promise<{ message: string; deleted_count: number }> {
    const response = await api.post('/todos/bulk-delete', { ids })
    return response.data
  },

  async bulkUpdateStatus(ids: number[], status: string): Promise<{ message: string; updated_count: number }> {
    const response = await api.post('/todos/bulk-update-status', { ids, status })
    return response.data
  },

  async bulkUpdatePriority(ids: number[], priority: string): Promise<{ message: string; updated_count: number }> {
    const response = await api.post('/todos/bulk-update-priority', { ids, priority })
    return response.data
  },
}

export default api
