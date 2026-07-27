import { useState, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Upload, AlertCircle } from 'lucide-react'
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE, MAX_FILE_SIZE_LABEL } from '../constants'

interface DropZoneProps {
  onFileSelect: (file: File) => void
  isLoading?: boolean
}

export default function DropZone({ onFileSelect, isLoading }: DropZoneProps) {
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const validateFile = useCallback((file: File): boolean => {
    setError(null)
    if (file.size > MAX_FILE_SIZE) {
      setError(`El archivo excede el l\u00edmite de ${MAX_FILE_SIZE_LABEL}`)
      return false
    }
    const ext = '.' + file.name.split('.').pop()?.toLowerCase()
    const validExts = Object.values(ACCEPTED_FILE_TYPES).flat()
    if (!validExts.includes(ext)) {
      setError('Formato no soportado. Usa CSV o Excel (.xlsx, .xls)')
      return false
    }
    return true
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && validateFile(file)) onFileSelect(file)
  }, [onFileSelect, validateFile])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && validateFile(file)) onFileSelect(file)
  }, [onFileSelect, validateFile])

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={cn(
        'relative cursor-pointer rounded-2xl border-2 border-dashed p-12 transition-all duration-300 text-center',
        dragOver
          ? 'border-purple-400 bg-purple-50/50 dark:bg-purple-500/5 scale-[1.02]'
          : 'border-gray-300 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30',
        isLoading && 'pointer-events-none opacity-60',
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        className="hidden"
        onChange={handleChange}
      />

      <div className="flex flex-col items-center gap-3">
        <div className={cn(
          'flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300',
          dragOver
            ? 'bg-gradient-to-br from-purple-500 to-indigo-500 scale-110 shadow-xl shadow-purple-500/30'
            : 'bg-gradient-to-br from-purple-500/10 to-indigo-500/10',
        )}>
          {isLoading ? (
            <svg className="animate-spin h-8 w-8 text-purple-600" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <Upload className={cn('h-8 w-8', dragOver ? 'text-white' : 'text-purple-600 dark:text-purple-400')} />
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {dragOver ? 'Suelta el archivo aqu\u00ed' : 'Arrastra tu archivo aqu\u00ed o haz clic para seleccionar'}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            CSV o Excel (.xlsx) — M\u00e1ximo {MAX_FILE_SIZE_LABEL}
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-xl px-4 py-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
    </div>
  )
}
