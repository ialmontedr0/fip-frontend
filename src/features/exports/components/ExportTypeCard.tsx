import { cn } from '@/lib/utils'
import { FileSpreadsheet, FileText, Calendar } from 'lucide-react'
import type { ExportTypeConfig } from '../constants'

interface ExportTypeCardProps {
  type: ExportTypeConfig
  selected: boolean
  onClick: () => void
}

const TYPE_ICONS: Record<string, typeof FileSpreadsheet> = {
  transactions: FileSpreadsheet,
  budgets: FileText,
  goals: FileText,
  calendar_recurring: Calendar,
  calendar_goals: Calendar,
}

export default function ExportTypeCard({ type, selected, onClick }: ExportTypeCardProps) {
  const Icon = TYPE_ICONS[type.id] || FileSpreadsheet

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex items-center gap-3 rounded-2xl border p-4 text-left transition-all duration-200',
        'hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]',
        selected
          ? 'border-purple-300 dark:border-purple-500/40 bg-white dark:bg-gray-900 shadow-md'
          : 'border-gray-100/80 dark:border-gray-700/60 bg-white/60 dark:bg-gray-900/60 hover:border-purple-200/50 dark:hover:border-purple-500/20',
      )}
    >
      <div className={cn(
        'flex h-10 w-10 items-center justify-center rounded-xl transition-all',
        selected
          ? 'bg-gradient-to-br from-purple-500/20 to-indigo-500/20'
          : 'bg-gray-100 dark:bg-gray-800',
      )}>
        <Icon className={cn('h-5 w-5', selected ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400')} />
      </div>
      <div>
        <p className={cn(
          'text-sm font-semibold',
          selected ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400',
        )}>
          {type.label}
        </p>
        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{type.description}</p>
      </div>
    </button>
  )
}
