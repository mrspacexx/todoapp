import React from 'react'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react'

interface BulkActionsToolbarProps {
  selectedCount: number
  onBulkDelete: () => void
  onBulkStatusChange: (status: string) => void
  onBulkPriorityChange: (priority: string) => void
  onClearSelection: () => void
}

export function BulkActionsToolbar({
  selectedCount,
  onBulkDelete,
  onBulkStatusChange,
  onBulkPriorityChange,
  onClearSelection
}: BulkActionsToolbarProps) {
  if (selectedCount === 0) return null

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-blue-900">
            {selectedCount} todo seçildi
          </span>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-blue-700">Status:</span>
            <Select
              value=""
              onChange={(e) => onBulkStatusChange(e.target.value)}
              className="w-32"
              options={[
                { value: '', label: 'Status Seç' },
                { value: 'todo', label: 'Yapılacak' },
                { value: 'in_progress', label: 'Devam Ediyor' },
                { value: 'done', label: 'Tamamlandı' }
              ]}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-blue-700">Öncelik:</span>
            <Select
              value=""
              onChange={(e) => onBulkPriorityChange(e.target.value)}
              className="w-32"
              options={[
                { value: '', label: 'Öncelik Seç' },
                { value: 'low', label: 'Düşük' },
                { value: 'medium', label: 'Orta' },
                { value: 'high', label: 'Yüksek' }
              ]}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={onBulkDelete}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Seçilenleri Sil
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onClearSelection}
          >
            Seçimi Temizle
          </Button>
        </div>
      </div>
    </div>
  )
}
