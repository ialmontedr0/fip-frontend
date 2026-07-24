import { useState, useRef, type DragEvent } from 'react'
import { cn } from '@/lib/utils'
import { Upload, File, X, Image, FileText, FileSpreadsheet } from 'lucide-react'
import { useUploadAttachment } from '../hooks/useAttachments'
import { Button } from '@/components/ui'

interface Props {
  transactionId: string
  onUploadComplete?: () => void
  className?: string
}

const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg', 'image/png', 'image/webp',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

const MAX_SIZE = 10 * 1024 * 1024 // 10MB

function getFileIcon(mime: string) {
  if (mime.startsWith('image/')) return Image
  if (mime.includes('pdf')) return FileText
  if (mime.includes('spreadsheet') || mime.includes('excel')) return FileSpreadsheet
  return File
}

export default function AttachmentUploader({ transactionId, onUploadComplete, className }: Props) {
  const [isDragging, setIsDragging] = useState(false)
  const [previews, setPreviews] = useState<Array<{ file: File; id: string }>>([])
  const fileRef = useRef<HTMLInputElement>(null)
  const uploadMutation = useUploadAttachment()

  const addFiles = (files: FileList) => {
    const valid = Array.from(files).filter((f) => {
      if (!ALLOWED_TYPES.includes(f.type) && !f.type.startsWith('image/')) {
        return false
      }
      if (f.size > MAX_SIZE) return false
      return true
    })
    setPreviews((prev) => [
      ...prev,
      ...valid.map((file) => ({ file, id: Math.random().toString(36).slice(2) })),
    ])
  }

  const removePreview = (id: string) => {
    setPreviews((prev) => prev.filter((p) => p.id !== id))
  }

  const uploadAll = async () => {
    for (const p of previews) {
      await uploadMutation.mutateAsync({ transactionId, file: p.file })
    }
    setPreviews([])
    onUploadComplete?.()
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files)
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  return (
    <div className={cn('space-y-3', className)}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileRef.current?.click()}
        className={cn(
          'relative cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all',
          'bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm',
          isDragging
            ? 'border-primary-400 bg-primary-50/50 dark:bg-primary-500/10 scale-[1.02]'
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-500',
        )}
      >
        <input
          ref={fileRef}
          type="file"
          multiple
          accept={ALLOWED_TYPES.join(',')}
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />

        <div className="flex flex-col items-center gap-2">
          <div className={cn(
            'flex h-12 w-12 items-center justify-center rounded-full transition-all',
            isDragging ? 'bg-primary-100 dark:bg-primary-500/20 scale-110' : 'bg-gray-100 dark:bg-gray-700',
          )}>
            <Upload className={cn('h-5 w-5', isDragging ? 'text-primary-600' : 'text-gray-400')} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {isDragging ? 'Suelta los archivos aqui' : 'Arrastra archivos o haz click'}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              PDF, JPG, PNG, WebP, Excel, Word — Max 10MB
            </p>
          </div>
        </div>
      </div>

      {previews.length > 0 && (
        <div className="space-y-2">
          {previews.map((p) => {
            const Icon = getFileIcon(p.file.type)
            return (
              <div
                key={p.id}
                className="flex items-center gap-3 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 px-3 py-2"
              >
                <Icon className="h-5 w-5 text-gray-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{p.file.name}</p>
                  <p className="text-xs text-gray-400">{(p.file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button
                  onClick={() => removePreview(p.id)}
                  className="flex h-6 w-6 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="h-3.5 w-3.5 text-gray-400" />
                </button>
              </div>
            )
          })}

          <Button
            onClick={uploadAll}
            isLoading={uploadMutation.isPending}
            className="w-full rounded-xl shadow-lg shadow-primary-500/20"
          >
            <Upload className="h-4 w-4 mr-2" />
            Subir {previews.length} archivo{previews.length !== 1 ? 's' : ''}
          </Button>
        </div>
      )}
    </div>
  )
}
