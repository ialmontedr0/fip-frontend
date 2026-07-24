import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Paperclip, File, Image, FileText, FileSpreadsheet, Trash2, Download,
} from 'lucide-react'
import { useDeleteAttachment } from '../hooks/useAttachments'
import type { AttachmentInfo } from '@/types/transactions'
import { Modal, Button } from '@/components/ui'

interface Props {
  attachments: AttachmentInfo[]
  transactionId: string
  onDelete?: () => void
  className?: string
}

function getFileIcon(mime: string) {
  if (mime.startsWith('image/')) return Image
  if (mime.includes('pdf')) return FileText
  if (mime.includes('spreadsheet') || mime.includes('excel')) return FileSpreadsheet
  return File
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function AttachmentList({ attachments, transactionId, onDelete, className }: Props) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const deleteMutation = useDeleteAttachment()

  if (attachments.length === 0) return null

  const handleDelete = async () => {
    if (!deleteId) return
    await deleteMutation.mutateAsync({ transactionId, attachmentId: deleteId })
    setDeleteId(null)
    onDelete?.()
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center gap-2 mb-2">
        <Paperclip className="h-4 w-4 text-gray-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Archivos Adjuntos ({attachments.length})
        </span>
      </div>

      {attachments.map((att) => {
        const Icon = getFileIcon(att.mime_type)
        return (
          <div
            key={att.id}
            className="flex items-center gap-3 rounded-xl bg-white/50 dark:bg-gray-700/30 border border-gray-200/50 dark:border-gray-600/30 px-3 py-2.5 group hover:shadow-sm transition-all"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
              <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                {att.original_filename}
              </p>
              <p className="text-xs text-gray-400">
                {formatSize(att.file_size)}
                {att.created_at && ` · ${new Date(att.created_at).toLocaleDateString('es-DO', { day: '2-digit', month: 'short' })}`}
              </p>
            </div>

            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                title="Descargar"
              >
                <Download className="h-4 w-4" />
              </button>
              <button
                onClick={() => setDeleteId(att.id)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                title="Eliminar"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        )
      })}

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} size="sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Eliminar Archivo</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Esta accion eliminara permanentemente este archivo adjunto.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setDeleteId(null)} className="rounded-xl">Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete} isLoading={deleteMutation.isPending} className="rounded-xl">
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
