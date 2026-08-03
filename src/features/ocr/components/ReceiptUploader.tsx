import { useRef, useState, type DragEvent } from 'react'
import { cn } from '@/lib/utils'
import { FileText, ImageIcon, ScanLine, X } from 'lucide-react'

const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.bmp', '.tiff', '.tif', '.pdf']
const MAX_SIZE_MB = 10

interface Props {
  onFileSelected: (file: File) => void
  className?: string
}

function previewUrlFor(file: File): string | null {
  if (file.type.startsWith('image/')) {
    return URL.createObjectURL(file)
  }
  return null
}

export default function ReceiptUploader({ onFileSelected, className }: Props) {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const selectFile = (file: File) => {
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase()
    if (!ALLOWED_EXTENSIONS.includes(ext)) return
    if (file.size > MAX_SIZE_MB * 1024 * 1024) return
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreview(file)
    setPreviewUrl(previewUrlFor(file))
    onFileSelected(file)
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files.length > 0) selectFile(e.dataTransfer.files[0])
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const clearPreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreview(null)
    setPreviewUrl(null)
  }

  return (
    <div className={cn('space-y-3', className)}>
      {preview ? (
        <div className="overflow-hidden rounded-2xl border border-gray-200/60 dark:border-gray-700/50 bg-white/60 dark:bg-gray-800/60">
          <div className="relative max-h-80 overflow-hidden bg-gray-100 dark:bg-gray-900">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt={preview.name}
                className="mx-auto max-h-80 object-contain"
              />
            ) : (
              <div className="flex h-52 flex-col items-center justify-center gap-2 text-gray-400">
                <FileText className="h-12 w-12" />
                <span className="text-sm font-medium">{preview.name}</span>
              </div>
            )}
            <button
              type="button"
              onClick={clearPreview}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              {previewUrl ? <ImageIcon className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
              <span className="truncate font-medium">{preview.name}</span>
              <span className="text-xs text-gray-400">{(preview.size / 1024).toFixed(1)} KB</span>
            </div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="text-sm text-primary-500 hover:underline"
            >
              Cambiar
            </button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileRef.current?.click()}
          className={cn(
            'relative cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all',
            'bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm',
            isDragging
              ? 'border-emerald-400 bg-emerald-50/50 dark:bg-emerald-500/10 scale-[1.02]'
              : 'border-gray-300 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-500',
          )}
        >
          <input
            ref={fileRef}
            type="file"
            accept={ALLOWED_EXTENSIONS.join(',')}
            className="hidden"
            onChange={(e) => e.target.files && selectFile(e.target.files[0])}
          />
          <div className="flex flex-col items-center gap-3">
            <div
              className={cn(
                'flex h-14 w-14 items-center justify-center rounded-full transition-all',
                isDragging ? 'bg-emerald-100 dark:bg-emerald-500/20 scale-110' : 'bg-gray-100 dark:bg-gray-700',
              )}
            >
              <ScanLine className={cn('h-6 w-6', isDragging ? 'text-emerald-600' : 'text-gray-400')} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {isDragging ? 'Suelta el recibo aqui' : 'Arrastra tu recibo o haz click'}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Imagen o PDF — Max {MAX_SIZE_MB}MB (PNG, JPG, WebP, TIFF, PDF)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
