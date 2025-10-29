import React from 'react'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Todo } from '@/types/todo'
import { KanbanColumn } from '@/components/KanbanColumn'
import { DraggableTodo } from '@/components/DraggableTodo'

interface KanbanBoardProps {
  todos: Todo[]
  loading: boolean
  error: string | null
  onEdit: (todo: Todo) => void
  onDelete: (id: number) => void
  onStatusChange: (id: number, status: Todo['status']) => void
  onCreateNew: () => void
  onRetry: () => void
  selectedTodos?: Set<number>
  onSelectTodo?: (id: number, selected: boolean) => void
}

const statusColumns = [
  { id: 'todo', title: 'Yapılacak', color: 'bg-slate-100' },
  { id: 'in_progress', title: 'Devam Ediyor', color: 'bg-yellow-100' },
  { id: 'done', title: 'Tamamlandı', color: 'bg-green-100' }
] as const

export function KanbanBoard({
  todos,
  loading,
  error,
  onEdit,
  onDelete,
  onStatusChange,
  onCreateNew,
  onRetry,
  selectedTodos = new Set(),
  onSelectTodo
}: KanbanBoardProps) {
  const [activeId, setActiveId] = React.useState<string | null>(null)
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (!over) return

    const todoId = parseInt(active.id as string)
    const newStatus = over.id as Todo['status']

    // Find the todo and check if status actually changed
    const todo = todos.find(t => t.id === todoId)
    if (todo && todo.status !== newStatus) {
      onStatusChange(todoId, newStatus)
    }

    setActiveId(null)
  }

  const getTodosByStatus = (status: string) => {
    return todos.filter(todo => todo.status === status)
  }

  const activeTodo = activeId ? todos.find(todo => todo.id === parseInt(activeId)) : null

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Hata Oluştu</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Tekrar Dene
          </button>
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
          <button
            onClick={onCreateNew}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Yeni Todo Oluştur
          </button>
        </div>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {statusColumns.map((column) => {
          const columnTodos = getTodosByStatus(column.id)
          
          return (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              color={column.color}
              todoCount={columnTodos.length}
            >
              <SortableContext
                items={columnTodos.map(todo => todo.id.toString())}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {columnTodos.map((todo) => (
                    <DraggableTodo
                      key={todo.id}
                      todo={todo}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      selected={selectedTodos.has(todo.id)}
                      onSelect={onSelectTodo}
                    />
                  ))}
                </div>
              </SortableContext>
            </KanbanColumn>
          )
        })}
      </div>

      <DragOverlay>
        {activeTodo ? (
          <div className="opacity-50">
            <DraggableTodo
              todo={activeTodo}
              onEdit={onEdit}
              onDelete={onDelete}
              selected={selectedTodos.has(activeTodo.id)}
              onSelect={onSelectTodo}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
