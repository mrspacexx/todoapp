import React, { useState, useEffect } from 'react'
import { Todo, CreateTodoRequest } from '@/types/todo'
import { createTodoSchema } from '@/lib/schemas'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { TagSelector } from '@/components/ui/TagSelector'

interface TodoFormProps {
  todo?: Todo
  onSubmit: (todo: CreateTodoRequest) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export function TodoForm({ todo, onSubmit, onCancel, loading = false }: TodoFormProps) {
  const [formData, setFormData] = useState<CreateTodoRequest>({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    tags: [],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title,
        description: todo.description || '',
        priority: todo.priority,
        dueDate: todo.dueDate ? todo.dueDate.split('T')[0] : '',
        tags: todo.tags?.map(tag => tag.id) || [],
      })
    }
  }, [todo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    try {
      const validatedData = createTodoSchema.parse(formData)
      await onSubmit(validatedData)
    } catch (error: any) {
      if (error.errors) {
        const fieldErrors: Record<string, string> = {}
        error.errors.forEach((err: any) => {
          fieldErrors[err.path[0]] = err.message
        })
        setErrors(fieldErrors)
      } else {
        setErrors({ general: error.message })
      }
    }
  }

  const handleChange = (field: keyof CreateTodoRequest, value: string | number[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const priorityOptions = [
    { value: 'low', label: 'Düşük' },
    { value: 'medium', label: 'Orta' },
    { value: 'high', label: 'Yüksek' },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{errors.general}</p>
        </div>
      )}

      <Input
        label="Başlık *"
        value={formData.title}
        onChange={(e) => handleChange('title', e.target.value)}
        error={errors.title}
        placeholder="Todo başlığını girin"
        required
      />

      <Textarea
        label="Açıklama"
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
        error={errors.description}
        placeholder="Todo açıklamasını girin (opsiyonel)"
        rows={3}
      />

      <Select
        label="Öncelik *"
        value={formData.priority}
        onChange={(e) => handleChange('priority', e.target.value as any)}
        error={errors.priority}
        options={priorityOptions}
        required
      />

      <Input
        label="Bitiş Tarihi"
        type="date"
        value={formData.dueDate}
        onChange={(e) => handleChange('dueDate', e.target.value)}
        error={errors.dueDate}
      />

      <TagSelector
        selectedTags={formData.tags || []}
        onTagsChange={(tags) => handleChange('tags', tags)}
      />

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          İptal
        </Button>
        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? 'Kaydediliyor...' : todo ? 'Güncelle' : 'Oluştur'}
        </Button>
      </div>
    </form>
  )
}
