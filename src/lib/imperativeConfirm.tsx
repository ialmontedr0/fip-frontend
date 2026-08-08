import { createRoot } from 'react-dom/client'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

interface ImperativeConfirmOptions {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
}

/**
 * Imperative promise-based confirm that mounts the accessible `ConfirmDialog`
 * outside the React tree. Used where a React component hook is not available
 * (e.g. the PWA service-worker update callback), replacing `window.confirm`.
 */
export function imperativeConfirm(opts: ImperativeConfirmOptions): Promise<boolean> {
  return new Promise((resolve) => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    const root = createRoot(container)

    const cleanup = () => {
      root.unmount()
      container.remove()
    }

    root.render(
      <ConfirmDialog
        open
        onClose={() => {
          cleanup()
          resolve(false)
        }}
        onConfirm={() => {
          cleanup()
          resolve(true)
        }}
        title={opts.title}
        message={opts.message}
        confirmLabel={opts.confirmLabel ?? 'Confirmar'}
        cancelLabel={opts.cancelLabel}
        destructive={opts.destructive ?? false}
      />,
    )
  })
}

export default imperativeConfirm