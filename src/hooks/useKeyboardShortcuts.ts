import { useEffect, useRef } from 'react'

type ShortcutHandler = (e: KeyboardEvent) => void

export interface ShortcutDefinition {
  key: string
  handler: ShortcutHandler
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  scope?: string
  preventDefault?: boolean
}

export function useKeyboardShortcuts(
  shortcuts: ShortcutDefinition[],
  activeScope?: string,
  enabled = true,
) {
  const handlerRef = useRef<ShortcutDefinition[]>(shortcuts)

  useEffect(() => {
    handlerRef.current = shortcuts
  }, [shortcuts])

  useEffect(() => {
    if (!enabled) return

    const onKeyDown = (e: KeyboardEvent) => {
      for (const def of handlerRef.current) {
        if (def.scope && activeScope && def.scope !== activeScope) continue
        const ctrlMatch = (def.ctrl ?? false) === e.ctrlKey
        const shiftMatch = (def.shift ?? false) === e.shiftKey
        const altMatch = (def.alt ?? false) === e.altKey
        const keyMatch = e.key.toLowerCase() === def.key.toLowerCase()

        if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
          if (def.preventDefault) e.preventDefault()
          def.handler(e)
          return
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeScope, enabled])
}