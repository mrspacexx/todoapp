import React, { useState, useEffect } from 'react'
import { TodoFilters, TodoStatus, TodoPriority, Tag } from '@/types/todo'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Tag as TagComponent } from '@/components/ui/Tag'
import { todoApi } from '@/lib/api'
import { Search, Filter, X } from 'lucide-react'

interface FilterBarProps {
  filters: TodoFilters
  onFiltersChange: (filters: TodoFilters) => void
  onClearFilters: () => void
}

export function FilterBar({ filters, onFiltersChange, onClearFilters }: FilterBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [availableTags, setAvailableTags] = useState<Tag[]>([])

  useEffect(() => {
    loadTags()
  }, [])

  const loadTags = async () => {
    try {
      const tags = await todoApi.getTags()
      setAvailableTags(tags)
    } catch (error) {
      console.error('Error loading tags:', error)
    }
  }

  const statusOptions = [
    { value: 'todo', label: 'Yapılacak' },
    { value: 'in_progress', label: 'Devam Ediyor' },
    { value: 'done', label: 'Tamamlandı' },
  ]

  const priorityOptions = [
    { value: 'low', label: 'Düşük' },
    { value: 'medium', label: 'Orta' },
    { value: 'high', label: 'Yüksek' },
  ]

  const sortOptions = [
    { value: 'createdAt:desc', label: 'En Yeni' },
    { value: 'createdAt:asc', label: 'En Eski' },
    { value: 'dueDate:asc', label: 'Bitiş Tarihi (Yakın)' },
    { value: 'dueDate:desc', label: 'Bitiş Tarihi (Uzak)' },
    { value: 'title:asc', label: 'Başlık (A-Z)' },
    { value: 'title:desc', label: 'Başlık (Z-A)' },
  ]

  const handleSearchChange = (value: string) => {
    onFiltersChange({
      ...filters,
      search: value || undefined,
      page: 1, // Reset to first page when searching
    })
  }

  const handleStatusChange = (value: string) => {
    const statusArray = value ? value.split(',') : []
    onFiltersChange({
      ...filters,
      status: statusArray.length > 0 ? statusArray as TodoStatus[] : undefined,
      page: 1,
    })
  }

  const handlePriorityChange = (value: string) => {
    const priorityArray = value ? value.split(',') : []
    onFiltersChange({
      ...filters,
      priority: priorityArray.length > 0 ? priorityArray as TodoPriority[] : undefined,
      page: 1,
    })
  }

  const handleSortChange = (value: string) => {
    onFiltersChange({
      ...filters,
      sort: value || undefined,
    })
  }

  const handleTagToggle = (tagId: number) => {
    const currentTags = filters.tags || []
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter(id => id !== tagId)
      : [...currentTags, tagId]
    
    onFiltersChange({
      ...filters,
      tags: newTags.length > 0 ? newTags : undefined,
      page: 1,
    })
  }

  const hasActiveFilters = filters.search || filters.status?.length || filters.priority?.length || filters.sort || filters.tags?.length

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
        <Input
          placeholder="Todo'larda ara..."
          value={filters.search || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-12 h-12 text-base border-slate-300 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select
          value={filters.status?.join(',') || ''}
          onChange={(e) => handleStatusChange(e.target.value)}
          options={[
            { value: '', label: 'Tüm Durumlar' },
            ...statusOptions,
            { value: 'todo,in_progress', label: 'Aktif (Yapılacak + Devam)' },
          ]}
          className="h-12"
        />

        <Select
          value={filters.priority?.join(',') || ''}
          onChange={(e) => handlePriorityChange(e.target.value)}
          options={[
            { value: '', label: 'Tüm Öncelikler' },
            ...priorityOptions,
          ]}
          className="h-12"
        />

        <Select
          value={filters.sort || ''}
          onChange={(e) => handleSortChange(e.target.value)}
          options={[
            { value: '', label: 'Sıralama Seçin' },
            ...sortOptions,
          ]}
          className="h-12"
        />

        <div className="flex space-x-2">
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="flex-1 h-12 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4 mr-2" />
              Temizle
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              Arama: {filters.search}
            </span>
          )}
          {filters.status?.map((status) => (
            <span
              key={status}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
            >
              Durum: {statusOptions.find(s => s.value === status)?.label}
            </span>
          ))}
          {filters.priority?.map((priority) => (
            <span
              key={priority}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800"
            >
              Öncelik: {priorityOptions.find(p => p.value === priority)?.label}
            </span>
          ))}
          {filters.sort && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              Sıralama: {sortOptions.find(s => s.value === filters.sort)?.label}
            </span>
          )}
          {filters.tags?.map((tagId) => {
            const tag = availableTags.find(t => t.id === tagId)
            return tag ? (
              <TagComponent
                key={tagId}
                tag={tag}
                onRemove={() => handleTagToggle(tagId)}
                className="text-xs"
              />
            ) : null
          })}
        </div>
      )}

      {/* Tag Filters */}
      {showAdvanced && availableTags.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-slate-700">Etiketler</div>
          <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => (
              <button
                key={tag.id}
                onClick={() => handleTagToggle(tag.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filters.tags?.includes(tag.id)
                    ? 'text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                style={{
                  backgroundColor: filters.tags?.includes(tag.id) ? tag.color : undefined
                }}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
