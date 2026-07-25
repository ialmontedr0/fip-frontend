import { useState } from 'react'
import { Modal, Button, Input } from '@/components/ui'
import { X, CalendarDays, DollarSign } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { ScheduleResponse, ReceiveScheduleRequest } from '@/types/incomes'

interface Props {
  isOpen: boolean
  onClose: () => void
  schedule: ScheduleResponse | null
  onConfirm: (data: ReceiveScheduleRequest) => void
  isSubmitting?: boolean
}

export default function ReceiveScheduleModal({ isOpen, onClose, schedule, onConfirm, isSubmitting }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const [receivedDate, setReceivedDate] = useState(today)
  const [notes, setNotes] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])

  const addTag = () => {
    const trimmed = tagInput.trim()
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed])
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleConfirm = () => {
    onConfirm({
      received_date: receivedDate || undefined,
      notes: notes || null,
      tags: tags.length > 0 ? tags : null,
    })
  }

  if (!schedule) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Recibir Ingreso Programado">
      <div className="space-y-4">
        <div className="rounded-xl bg-blue-50 dark:bg-blue-500/5 p-3">
          <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
            <CalendarDays className="h-4 w-4" />
            <span className="font-medium">{schedule.description}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/5 px-3 py-2">
          <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            Monto: {formatCurrency(Number(schedule.amount))}
          </span>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de Recepcion</label>
          <Input
            type="date"
            value={receivedDate}
            onChange={(e) => setReceivedDate(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notas</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Notas opcionales..."
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2 text-sm backdrop-blur-sm dark:text-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 placeholder:text-gray-400 resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tags</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
              placeholder="Agregar tag..."
              className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2 text-sm backdrop-blur-sm dark:text-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 placeholder:text-gray-400"
            />
            <Button type="button" variant="outline" onClick={addTag} className="rounded-xl">Agregar</Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-gray-100 dark:bg-gray-700/50 px-2 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-300"
                >
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose} className="rounded-xl">
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={isSubmitting} className="rounded-xl">
            {isSubmitting ? 'Procesando...' : 'Confirmar Recepcion'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
