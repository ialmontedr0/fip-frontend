import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Modal, Button } from '@/components/ui'
import { INCOME_STATUS_CONFIG } from '../constants'
import { CheckCircle2 } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
  selectedCount: number
  onConfirm: (status: string) => void
  isSubmitting?: boolean
}

export default function BatchStatusModal({ isOpen, onClose, selectedCount, onConfirm, isSubmitting }: Props) {
  const [selectedStatus, setSelectedStatus] = useState<string>('received')

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Actualizacion Masiva">
      <div className="space-y-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {selectedCount} ingreso{selectedCount !== 1 ? 's' : ''} seleccionado{selectedCount !== 1 ? 's' : ''}
        </p>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nuevo Estado</label>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(INCOME_STATUS_CONFIG).map(([key, config]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedStatus(key)}
                className={cn(
                  'flex items-center gap-3 rounded-xl border-2 p-3 transition-all text-left',
                  selectedStatus === key
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300',
                )}
              >
                <config.icon className={cn('h-5 w-5', config.color)} />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{config.label}</p>
                </div>
                {selectedStatus === key && (
                  <CheckCircle2 className="ml-auto h-5 w-5 text-primary-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose} className="rounded-xl">
            Cancelar
          </Button>
          <Button
            onClick={() => onConfirm(selectedStatus)}
            disabled={isSubmitting}
            className="rounded-xl"
          >
            {isSubmitting ? 'Actualizando...' : `Actualizar ${selectedCount} ingreso${selectedCount !== 1 ? 's' : ''}`}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
