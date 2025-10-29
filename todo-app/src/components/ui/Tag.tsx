import React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TagProps {
  tag: {
    id: number
    name: string
    color: string
  }
  onRemove?: (id: number) => void
  className?: string
}

export function Tag({ tag, onRemove, className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white',
        className
      )}
      style={{ backgroundColor: tag.color }}
    >
      {tag.name}
      {onRemove && (
        <button
          onClick={() => onRemove(tag.id)}
          className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  )
}
