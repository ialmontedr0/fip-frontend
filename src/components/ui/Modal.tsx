import { useEffect, useCallback, useRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import FocusTrap from './FocusTrap'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnOverlay?: boolean
}

function Modal({ isOpen, onClose, title, children, size = 'md', closeOnOverlay = true }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  const handleOverlayClick = useCallback(() => {
    if (closeOnOverlay) onClose()
  }, [closeOnOverlay, onClose])

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'

      setTimeout(() => dialogRef.current?.focus(), 50)
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
      previousFocusRef.current?.focus()
    }
  }, [isOpen, handleEscape])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-4xl',
  }

  return (
    <FocusTrap active={isOpen}>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={title || 'Dialog'}
          tabIndex={-1}
          className={cn(
            'relative z-50 w-full rounded-xl bg-white p-6 shadow-xl outline-none',
            'dark:bg-gray-800',
            'animate-fade-in',
            sizeClasses[size],
            'mx-4',
          )}
        >
          {title && (
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
              <button
                onClick={onClose}
                className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          )}
          {children}
        </div>
      </div>
    </FocusTrap>
  )
}

export default Modal
