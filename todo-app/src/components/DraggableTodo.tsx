import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Todo } from '@/types/todo'
import { Button } from '@/components/ui/Button'
import { Tag } from '@/components/ui/Tag'
import { getStatusColor, getPriorityColor, getStatusText, getPriorityText, formatDateTime } from '@/lib/utils'
import { Edit, Trash2, Calendar, Clock, AlertCircle, CheckCircle, GripVertical } from 'lucide-react'

interface DraggableTodoProps {
  todo: Todo
  onEdit: (todo: Todo) => void
  onDelete: (id: number) => void
  selected?: boolean
  onSelect?: (id: number, selected: boolean) => void
}

export function DraggableTodo({ todo, onEdit, onDelete, selected = false, onSelect }: DraggableTodoProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id.toString() })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'todo':
        return <span className="text-lg">📋</span>
      case 'in_progress':
        return <span className="text-lg">⏳</span>
      case 'done':
        return <span className="text-lg">✅</span>
      default:
        return <span className="text-lg">📋</span>
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all duration-200 group cursor-grab active:cursor-grabbing',
        selected ? 'ring-2 ring-blue-500 bg-blue-50' : '',
        isDragging ? 'opacity-50' : ''
      )}
    >
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="mt-1 p-1 hover:bg-slate-100 rounded cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4 text-slate-400" />
        </div>

        {/* Checkbox */}
        {onSelect && (
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => onSelect(todo.id, e.target.checked)}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            onClick={(e) => e.stopPropagation()}
          />
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {getStatusIcon(todo.status)}
              <h3 className="font-semibold text-slate-900 truncate">{todo.title}</h3>
            </div>
            <div className="flex items-center gap-1 ml-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(todo)}
                className="p-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(todo.id)}
                className="p-1 h-6 w-6 text-red-600 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {todo.description && (
            <p className="text-slate-600 text-sm line-clamp-2 mb-3">
              {todo.description}
            </p>
          )}

          {/* Tags */}
          {todo.tags && todo.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {todo.tags.map(tag => (
                <Tag key={tag.id} tag={tag} />
              ))}
            </div>
          )}

          {/* Status and Priority Badges */}
          <div className="flex items-center gap-2 mb-3">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(todo.status)}`}>
              {getStatusText(todo.status)}
            </span>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(todo.priority)}`}>
              {getPriorityText(todo.priority)}
            </span>
          </div>

          {/* Due Date */}
          {todo.dueDate && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Calendar className="h-3 w-3" />
              <span>{formatDateTime(todo.dueDate)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
