import { Modal, Button } from '@/components/ui'
import { AlertTriangle } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  categoryName: string
  isDeleting: boolean
}

export default function DeleteCategoryModal({ isOpen, onClose, onConfirm, categoryName, isDeleting }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Eliminar Categoria">
      <div className="flex flex-col items-center text-center p-6">
        <div className="mb-4 rounded-full bg-gradient-to-br from-red-50 to-red-100 p-4 dark:from-red-500/20 dark:to-red-500/10">
          <AlertTriangle className="h-7 w-7 text-red-600 dark:text-red-400" />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 max-w-sm">
          Esta accion eliminara la categoria <strong className="text-gray-900 dark:text-gray-100">{categoryName}</strong>.
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Las subcategorias asociadas tambien se eliminaran.
        </p>
        <div className="flex gap-3 mt-2">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Eliminando...
              </span>
            ) : 'Eliminar Categoria'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
