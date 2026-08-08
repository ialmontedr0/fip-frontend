import { useCallback, useRef, useState } from 'react'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

interface ConfirmOptions {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
}

/**
 * Promise-based confirmation dialog built on the accessible `ConfirmDialog`
 * (FocusTrap + dark-mode). Replaces synchronous `window.confirm`.
 *
 * @example
 *   const { confirm, confirmDialog } = useConfirm()
 *   ...
 *   if (!(await confirm({ title: 'Eliminar', message: '¿Seguro?', destructive: true }))) return
 *   await deleteMutation.mutateAsync(id)
 *   ...
 *   return (<>{confirmDialog}</>)
 */
function useConfirm() {
  const [options, setOptions] = useState<ConfirmOptions | null>(null)
  const resolver = useRef<((value: boolean) => void) | null>(null)

  const confirm = useCallback((opts: ConfirmOptions) => {
    setOptions(opts)
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve
    })
  }, [])

  const handleClose = useCallback(() => {
    resolver.current?.(false)
    resolver.current = null
    setOptions(null)
  }, [])

  const handleConfirm = useCallback(() => {
    resolver.current?.(true)
    resolver.current = null
    setOptions(null)
  }, [])

  const confirmDialog = options ? (
    <ConfirmDialog
      open
      onClose={handleClose}
      onConfirm={handleConfirm}
      title={options.title}
      message={options.message}
      confirmLabel={options.confirmLabel}
      cancelLabel={options.cancelLabel}
      destructive={options.destructive}
    />
  ) : null

  return { confirm, confirmDialog }
}

export default useConfirm
