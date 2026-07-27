import { cn } from '@/lib/utils'
import { Loader2, CheckCircle2 } from 'lucide-react'
import type { ExportProgressState } from '../constants'

interface ExportProgressBarProps {
  progress: ExportProgressState
}

export default function ExportProgressBar({ progress }: ExportProgressBarProps) {
  if (!progress.inProgress && progress.percentage === 0) return null

  const isComplete = progress.percentage === 100

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 p-4 shadow-sm animate-fade-in-up">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          {isComplete ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          ) : (
            <Loader2 className="h-5 w-5 text-purple-500 animate-spin" />
          )}
          <div>
            <p className="text-xs font-semibold text-gray-900 dark:text-white">
              {isComplete ? 'Descarga lista' : 'Preparando exportaci\u00f3n...'}
            </p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500">{progress.fileName}</p>
          </div>
        </div>
        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 tabular-nums">
          {progress.percentage}%
        </span>
      </div>

      <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            isComplete
              ? 'bg-gradient-to-r from-emerald-500 to-green-500'
              : 'bg-gradient-to-r from-purple-500 to-indigo-500',
          )}
          style={{ width: `${progress.percentage}%` }}
        />
      </div>
    </div>
  )
}
