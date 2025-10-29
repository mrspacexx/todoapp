import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import { cn } from '@/lib/utils'

interface KanbanColumnProps {
  id: string
  title: string
  color: string
  todoCount: number
  children: React.ReactNode
}

export function KanbanColumn({ id, title, color, todoCount, children }: KanbanColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'rounded-xl border-2 border-dashed transition-colors duration-200 min-h-[500px]',
        color,
        isOver ? 'border-blue-400 bg-blue-50' : 'border-slate-200'
      )}
    >
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <span className="px-2 py-1 text-xs font-medium bg-white rounded-full text-slate-600">
            {todoCount}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        {children}
      </div>
    </div>
  )
}
