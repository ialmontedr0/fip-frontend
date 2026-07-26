import { useState, useEffect, useRef } from 'react'
import { Play, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ExecuteRuleResponse } from '@/types/automations'

interface ManualExecuteButtonProps {
  ruleId: string
  onExecute: (ruleId: string) => Promise<ExecuteRuleResponse | undefined>
  isPending: boolean
  result?: ExecuteRuleResponse | null
}

export default function ManualExecuteButton({ ruleId, onExecute, isPending }: ManualExecuteButtonProps) {
  const [feedback, setFeedback] = useState<'success' | 'error' | null>(null)
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 2000)
      return () => clearTimeout(timer)
    }
  }, [feedback])

  useEffect(() => {
    if (ripple) {
      const timer = setTimeout(() => setRipple(null), 600)
      return () => clearTimeout(timer)
    }
  }, [ripple])

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isPending) return
    const rect = buttonRef.current?.getBoundingClientRect()
    if (rect) {
      setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }
    try {
      const res = await onExecute(ruleId)
      if (res?.status === 'executed' || res?.status === 'dry_run') {
        setFeedback('success')
      } else {
        setFeedback('error')
      }
    } catch {
      setFeedback('error')
    }
  }

  if (feedback === 'success') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-500/20 border border-green-200/50 dark:border-green-500/30 animate-fade-in shadow-sm">
        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-green-500/20">
          <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
        </span>
        Ejecutado
      </span>
    )
  }

  if (feedback === 'error') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-500/20 border border-red-200/50 dark:border-red-500/30 animate-fade-in shadow-sm">
        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500/20">
          <X className="h-3 w-3 text-red-600 dark:text-red-400" />
        </span>
        Error
      </span>
    )
  }

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        'relative overflow-hidden inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all duration-300 active:scale-[0.97]',
        isPending
          ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
          : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5',
      )}
    >
      {ripple && (
        <span
          className="absolute w-20 h-20 rounded-full bg-white/20 animate-ripple pointer-events-none"
          style={{ left: ripple.x - 40, top: ripple.y - 40 }}
        />
      )}
      {isPending ? (
        <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <Play className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-12" />
      )}
      {isPending ? 'Ejecutando...' : 'Ejecutar'}
    </button>
  )
}
