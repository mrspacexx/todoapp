import React from 'react'
import { Todo } from '@/types/todo'
import { TodoCard } from '@/components/TodoCard'
import { Button } from '@/components/ui/Button'
import { Plus, Loader2 } from 'lucide-react'
import { Spinner } from '@/components/ui/Spinner'

interface TodoListProps {
  todos: Todo[]
  loading: boolean
  error: string | null
  onEdit: (todo: Todo) => void
  onDelete: (id: number) => void
  onStatusChange: (id: number, status: Todo['status']) => void
  onCreateNew: () => void
  onRetry: () => void
  viewMode?: 'list' | 'grid' | 'kanban'
  selectedTodos?: Set<number>
  onSelectTodo?: (id: number, selected: boolean) => void
}

export function TodoList({
  todos,
  loading,
  error,
  onEdit,
  onDelete,
  onStatusChange,
  onCreateNew,
  onRetry,
  viewMode = 'grid',
  selectedTodos = new Set(),
  onSelectTodo
}: TodoListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="relative">
            <Spinner size="lg" className="mx-auto mb-6" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          </div>
          <p className="text-slate-600 font-medium">Todo&apos;lar yükleniyor...</p>
          <p className="text-sm text-slate-500 mt-2">Lütfen bekleyin</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Hata Oluştu</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={onRetry} variant="outline">
            Tekrar Dene
          </Button>
        </div>
      </div>
    )
  }

  if (todos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Henüz Todo Yok</h3>
          <p className="text-gray-600 mb-4">
            İlk todo&apos;nuzu oluşturmak için aşağıdaki butona tıklayın.
          </p>
          <Button onClick={onCreateNew} className="inline-flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Yeni Todo Oluştur
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {todos.map((todo) => (
            <TodoCard
              key={todo.id}
              todo={todo}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
              selected={selectedTodos.has(todo.id)}
              onSelect={onSelectTodo}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {todos.map((todo) => (
            <div key={todo.id} className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <TodoCard
                todo={todo}
                onEdit={onEdit}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
                compact={true}
                selected={selectedTodos.has(todo.id)}
                onSelect={onSelectTodo}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
