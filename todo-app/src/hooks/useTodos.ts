import { useState, useEffect, useCallback } from 'react'
import { Todo, TodoFilters, TodoResponse, CreateTodoRequest, UpdateTodoRequest } from '@/types/todo'
import { todoApi } from '@/lib/api'

interface UseTodosReturn {
  todos: Todo[]
  loading: boolean
  error: string | null
  meta: TodoResponse['meta'] | null
  refetch: () => Promise<void>
  createTodo: (todo: CreateTodoRequest) => Promise<void>
  updateTodo: (id: number, todo: UpdateTodoRequest) => Promise<void>
  deleteTodo: (id: number) => Promise<void>
}

export function useTodos(filters: TodoFilters = {}): UseTodosReturn {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [meta, setMeta] = useState<TodoResponse['meta'] | null>(null)

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await todoApi.getTodos(filters)
      setTodos(data.data)
      setMeta(data.meta)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching todos:', err)
    } finally {
      setLoading(false)
    }
  }, [filters])

  const createTodo = useCallback(async (todo: CreateTodoRequest) => {
    try {
      await todoApi.createTodo(todo)
      await fetchTodos() // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error creating todo:', err)
      throw err
    }
  }, [fetchTodos])

  const updateTodo = useCallback(async (id: number, todo: UpdateTodoRequest) => {
    try {
      await todoApi.updateTodo(id, todo)
      await fetchTodos() // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error updating todo:', err)
      throw err
    }
  }, [fetchTodos])

  const deleteTodo = useCallback(async (id: number) => {
    try {
      await todoApi.deleteTodo(id)
      await fetchTodos() // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error deleting todo:', err)
      throw err
    }
  }, [fetchTodos])

  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

  return {
    todos,
    loading,
    error,
    meta,
    refetch: fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
  }
}
