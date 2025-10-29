import React from 'react'
import { Todo } from '@/types/todo'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Tag } from '@/components/ui/Tag'
import { getStatusColor, getPriorityColor, getStatusText, getPriorityText, formatDateTime } from '@/lib/utils'
import { Edit, Trash2, Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react'

interface TodoCardProps {
  todo: Todo
  onEdit: (todo: Todo) => void
  onDelete: (id: number) => void
  onStatusChange: (id: number, status: Todo['status']) => void
  compact?: boolean
  selected?: boolean
  onSelect?: (id: number, selected: boolean) => void
}

export function TodoCard({ todo, onEdit, onDelete, onStatusChange, compact = false, selected = false, onSelect }: TodoCardProps) {
  const statusOptions = [
    { value: 'todo', label: 'Yapılacak' },
    { value: 'in_progress', label: 'Devam Ediyor' },
    { value: 'done', label: 'Tamamlandı' },
  ]

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

  if (compact) {
    return (
      <div className={`flex items-center justify-between p-4 hover:bg-slate-50 transition-colors ${selected ? 'bg-blue-50' : ''}`}>
        <div className="flex items-center space-x-4 flex-1">
          {onSelect && (
            <input
              type="checkbox"
              checked={selected}
              onChange={(e) => onSelect(todo.id, e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          )}
          <div className="flex items-center space-x-2">
            {getStatusIcon(todo.status)}
            <h3 className="font-medium text-slate-900 truncate">{todo.title}</h3>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(todo.status)}>
              {getStatusText(todo.status)}
            </Badge>
            <Badge className={getPriorityColor(todo.priority)}>
              {getPriorityText(todo.priority)}
            </Badge>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={todo.status}
            onChange={(e) => onStatusChange(todo.id, e.target.value as Todo['status'])}
            className="text-sm border border-slate-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(todo)}
            className="p-1 h-8 w-8"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(todo.id)}
            className="p-1 h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all duration-200 group ${selected ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          {onSelect && (
            <input
              type="checkbox"
              checked={selected}
              onChange={(e) => onSelect(todo.id, e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          )}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900 line-clamp-2 mb-2">
              {todo.title}
            </h3>
            {todo.description && (
              <p className="text-slate-600 text-sm line-clamp-3 mb-4">
                {todo.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(todo)}
            className="p-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(todo.id)}
            className="p-2 h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Badge className={`${getStatusColor(todo.status)} flex items-center space-x-1`}>
            {getStatusIcon(todo.status)}
            <span>{getStatusText(todo.status)}</span>
          </Badge>
          <Badge className={getPriorityColor(todo.priority)}>
            {getPriorityText(todo.priority)}
          </Badge>
        </div>
      </div>

      {/* Tags */}
      {todo.tags && todo.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {todo.tags.map(tag => (
            <Tag key={tag.id} tag={tag} />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
        <div className="flex items-center space-x-4">
          <span>Oluşturuldu: {formatDateTime(todo.createdAt)}</span>
          {todo.dueDate && (
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>Bitiş: {formatDateTime(todo.dueDate)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <select
          value={todo.status}
          onChange={(e) => onStatusChange(todo.id, e.target.value as Todo['status'])}
          className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
