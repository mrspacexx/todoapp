import React, { useState, useEffect } from 'react'
import { Tag as TagType } from '@/types/todo'
import { todoApi } from '@/lib/api'
import { Tag } from './Tag'
import { Button } from './Button'
import { Input } from './Input'
import { Plus, X } from 'lucide-react'

interface TagSelectorProps {
  selectedTags: number[]
  onTagsChange: (tagIds: number[]) => void
  className?: string
}

export function TagSelector({ selectedTags, onTagsChange, className }: TagSelectorProps) {
  const [availableTags, setAvailableTags] = useState<TagType[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [newTagName, setNewTagName] = useState('')
  const [newTagColor, setNewTagColor] = useState('#3B82F6')
  const [loading, setLoading] = useState(false)

  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ]

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

  const handleTagToggle = (tagId: number) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter(id => id !== tagId))
    } else {
      onTagsChange([...selectedTags, tagId])
    }
  }

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return

    setLoading(true)
    try {
      const newTag = await todoApi.createTag(newTagName.trim(), newTagColor)
      setAvailableTags([...availableTags, newTag])
      onTagsChange([...selectedTags, newTag.id])
      setNewTagName('')
      setNewTagColor('#3B82F6')
      // Keep dropdown open after creating
    } catch (error) {
      console.error('Error creating tag:', error)
      alert('Etiket oluşturulurken hata oluştu!')
    } finally {
      setLoading(false)
    }
  }

  const selectedTagObjects = availableTags.filter(tag => selectedTags.includes(tag.id))

  return (
    <div className={className}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Etiketler</label>
        
        {/* Selected Tags */}
        <div className="flex flex-wrap gap-2">
          {selectedTagObjects.map(tag => (
            <Tag
              key={tag.id}
              tag={tag}
              onRemove={(id) => handleTagToggle(id)}
            />
          ))}
        </div>

        {/* Tag Selector */}
        <div className="relative">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full justify-between"
          >
            <span>Etiket Seç</span>
            <Plus className="h-4 w-4" />
          </Button>

          {isOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-[60]" 
                onClick={() => setIsOpen(false)}
              />
              
              {/* Dropdown */}
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-[70] max-h-80 overflow-y-auto">
                {/* Available Tags */}
                <div className="p-3">
                  <div className="text-sm font-medium text-slate-700 mb-3">Mevcut Etiketler</div>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {availableTags.length === 0 ? (
                      <div className="text-sm text-slate-500 py-2">Henüz etiket yok</div>
                    ) : (
                      availableTags.map(tag => (
                        <button
                          key={tag.id}
                          onClick={() => handleTagToggle(tag.id)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-slate-100 flex items-center gap-3 transition-colors ${
                            selectedTags.includes(tag.id) ? 'bg-blue-50 border border-blue-200' : ''
                          }`}
                        >
                          <div
                            className="w-4 h-4 rounded-full flex-shrink-0"
                            style={{ backgroundColor: tag.color }}
                          />
                          <span className="truncate">{tag.name}</span>
                          {selectedTags.includes(tag.id) && (
                            <div className="ml-auto text-blue-600 text-xs">✓</div>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* Create New Tag */}
                <div className="border-t border-slate-200 p-3">
                  <div className="text-sm font-medium text-slate-700 mb-3">Yeni Etiket Oluştur</div>
                  <div className="space-y-3">
                    <Input
                      placeholder="Etiket adı girin"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      className="text-sm"
                    />
                    
                    <div>
                      <div className="text-xs text-slate-600 mb-2">Renk seçin:</div>
                      <div className="flex gap-2 flex-wrap">
                        {colors.map(color => (
                          <button
                            key={color}
                            onClick={() => setNewTagColor(color)}
                            className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                              newTagColor === color ? 'border-slate-600 shadow-md' : 'border-slate-300 hover:border-slate-400'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={handleCreateTag}
                      disabled={!newTagName.trim() || loading}
                      size="sm"
                      className="w-full"
                    >
                      {loading ? 'Oluşturuluyor...' : 'Etiket Oluştur'}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
