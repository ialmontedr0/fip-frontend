import { useCallback, useState } from 'react'

interface UseUndoOptions {
  onUndo?: (state: unknown) => void
  onRedo?: (state: unknown) => void
}

interface UndoState<T> {
  state: T
  past: T[]
  future: T[]
}

/**
 * Mini state manager con undo/redo para acciones del usuario.
 */
export function useUndo<T>(initial: T, options: UseUndoOptions = {}) {
  const [history, setHistory] = useState<UndoState<T>>({
    state: initial,
    past: [],
    future: [],
  })

  const set = useCallback((next: T | ((prev: T) => T)) => {
    setHistory(({ state, past }) => {
      const value = next instanceof Function ? next(state) : next
      return { state: value, past: [...past.slice(-49), state], future: [] }
    })
  }, [])

  const undo = useCallback(() => {
    setHistory(({ state, past, future }) => {
      if (past.length === 0) return { state, past, future }
      const previous = past[past.length - 1]
      options.onUndo?.(previous)
      return {
        state: previous,
        past: past.slice(0, -1),
        future: [state, ...future],
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.onUndo])

  const redo = useCallback(() => {
    setHistory(({ state, past, future }) => {
      if (future.length === 0) return { state, past, future }
      const next = future[0]
      options.onRedo?.(next)
      return {
        state: next,
        past: [...past, state],
        future: future.slice(1),
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.onRedo])

  const reset = useCallback((next: T) => {
    setHistory({ state: next, past: [], future: [] })
  }, [])

  return {
    state: history.state,
    set,
    undo,
    redo,
    reset,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
  }
}
