import { useCallback, useRef, useState } from 'react'

interface UseUndoOptions {
  onUndo?: (state: unknown) => void
  onRedo?: (state: unknown) => void
}

/**
 * Mini state manager con undo/redo para acciones del usuario.
 */
export function useUndo<T>(initial: T, options: UseUndoOptions = {}) {
  const [state, setState] = useState<T>(initial)
  const past = useRef<T[]>([])
  const future = useRef<T[]>([])
  const [canUndo, setCanUndo] = useState<boolean>(false)
  const [canRedo, setCanRedo] = useState<boolean>(false)

  const set = useCallback((next: T | ((prev: T) => T)) => {
    setState((prev) => {
      const value = next instanceof Function ? next(prev) : next
      past.current = [...past.current.slice(-49), prev]
      future.current = []
      setCanUndo(past.current.length > 0)
      setCanRedo(false)
      return value
    })
  }, [])

  const undo = useCallback(() => {
    setState((prev) => {
      if (past.current.length === 0) return prev
      const previous = past.current[past.current.length - 1]
      past.current = past.current.slice(0, -1)
      future.current = [prev, ...future.current]
      setCanUndo(past.current.length > 0)
      setCanRedo(future.current.length > 0)
      options.onUndo?.(previous)
      return previous
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.onUndo])

  const redo = useCallback(() => {
    setState((prev) => {
      if (future.current.length === 0) return prev
      const next = future.current[0]
      future.current = future.current.slice(1)
      past.current = [...past.current, prev]
      setCanUndo(true)
      setCanRedo(future.current.length > 0)
      options.onRedo?.(next)
      return next
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.onRedo])

  const reset = useCallback((next: T) => {
    past.current = []
    future.current = []
    setCanUndo(false)
    setCanRedo(false)
    setState(next)
  }, [])

  return {
    state,
    set,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
  }
}
