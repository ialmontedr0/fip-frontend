import { useCallback, useEffect, useRef, type ReactNode } from 'react'

interface FocusTrapProps {
  children: ReactNode
  active?: boolean
  onEscape?: () => void
}

export default function FocusTrap({ children, active = true, onEscape }: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onEscape?.()
        return
      }
      if (e.key !== 'Tab') return

      const focusables = Array.from(
        containerRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      )
      if (focusables.length === 0) return

      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const activeEl = document.activeElement as HTMLElement

      if (e.shiftKey) {
        if (activeEl === first || !containerRef.current?.contains(activeEl)) {
          e.preventDefault()
          last.focus()
        }
      } else if (activeEl === last || !containerRef.current?.contains(activeEl)) {
        e.preventDefault()
        first.focus()
      }
    },
    [onEscape],
  )

  useEffect(() => {
    if (!active) return
    const node = containerRef.current
    node?.focus()
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [active, handleKeyDown])

  return (
    <div ref={containerRef} tabIndex={-1} className="outline-none">
      {children}
    </div>
  )
}