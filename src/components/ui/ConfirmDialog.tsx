import { useEffect, useCallback, useRef } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import FocusTrap from './FocusTrap'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  isLoading?: boolean
}

function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  destructive = false,
  isLoading = false,
}: ConfirmDialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null)

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) onClose()
    },
    [onClose, isLoading],
  )

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
      confirmRef.current?.focus()
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [open, handleEscape])

  if (!open) return null

  return (
    <FocusTrap active={open}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          onClick={isLoading ? undefined : onClose}
          aria-hidden="true"
        />
        <div
          role="alertdialog"
          aria-modal="true"
          aria-label={title}
          className={cn(
            'relative z-50 w-full max-w-sm rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white dark:bg-gray-900 shadow-2xl p-6',
            'animate-fade-in',
          )}
        >
          <div className="flex flex-col items-center text-center mb-6">
            <div className={cn(
              'rounded-full p-3 mb-4',
              destructive ? 'bg-red-100 dark:bg-red-900/30' : 'bg-gray-100 dark:bg-gray-800',
            )}>
              <AlertTriangle className={cn(
                'h-6 w-6',
                destructive ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400',
              )} />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs">{message}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-all"
            >
              {cancelLabel}
            </button>
            <button
              ref={confirmRef}
              onClick={onConfirm}
              disabled={isLoading}
              className={cn(
                'flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-lg disabled:opacity-50 transition-all',
                destructive
                  ? 'bg-red-600 hover:bg-red-700 shadow-red-500/25'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-purple-500/40 shadow-purple-500/25',
              )}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </FocusTrap>
  )
}

export default ConfirmDialog
