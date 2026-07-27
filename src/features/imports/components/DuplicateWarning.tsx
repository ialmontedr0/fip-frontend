import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

interface DuplicateWarningProps {
  count: number
  details?: Record<string, unknown>[]
}

export default function DuplicateWarning({ count, details }: DuplicateWarningProps) {
  const [expanded, setExpanded] = useState(false)

  if (count === 0) return null

  return (
    <div className="rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between p-3.5 text-left"
      >
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
            {count} posible(s) duplicado(s) detectado(s)
          </span>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4 text-amber-500" /> : <ChevronDown className="h-4 w-4 text-amber-500" />}
      </button>
      {expanded && details && (
        <div className="px-3.5 pb-3.5 space-y-1">
          {details.map((d, i) => (
            <div key={i} className="text-[10px] text-amber-700 dark:text-amber-400 font-mono bg-amber-100/50 dark:bg-amber-500/5 rounded-lg px-2 py-1">
              {JSON.stringify(d)}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
