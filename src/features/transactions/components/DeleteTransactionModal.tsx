import { useState } from 'react'
import { AlertTriangle, Trash2 } from 'lucide-react'
import { Modal, Button } from '@/components/ui'

interface Props {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  description: string
  hasAttachments?: boolean
  attachmentCount?: number
  isTransfer?: boolean
  isLoading?: boolean
}

export default function DeleteTransactionModal({
  isOpen, onClose, onConfirm, description,
  hasAttachments, attachmentCount, isTransfer, isLoading,
}: Props) {
  const [confirmText, setConfirmText] = useState('')

  const truncated = description.length > 80 ? description.slice(0, 80) + '...' : description

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/10">
            <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {isTransfer ? 'Eliminar Transferencia' : 'Eliminar Transaccion'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Esta accion no se puede deshacer
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-3 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-700 dark:text-gray-300">{truncated}</p>
          </div>

          {hasAttachments && (
            <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 rounded-xl px-3 py-2">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <span>Tiene {attachmentCount} archivo{attachmentCount !== 1 ? 's' : ''} adjunto{attachmentCount !== 1 ? 's' : ''} que se eliminara{attachmentCount !== 1 ? 'n' : ''} permanentemente.</span>
            </div>
          )}

          {isTransfer && (
            <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 rounded-xl px-3 py-2">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <span>Esta transaccion es parte de una transferencia. Se eliminaran ambas transacciones (origen y destino).</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-xl px-3 py-2">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            <span>El balance de la cuenta se actualizara automaticamente.</span>
          </div>

          <div className="pt-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Escribe <strong>ELIMINAR</strong> para confirmar
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="ELIMINAR"
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2 text-sm backdrop-blur-sm dark:text-gray-200 focus:border-red-400 focus:ring-2 focus:ring-red-500/20 placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose} className="rounded-xl">
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={confirmText !== 'ELIMINAR' || isLoading}
            isLoading={isLoading}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isTransfer ? 'Eliminar Transferencia' : 'Eliminar Transaccion'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
