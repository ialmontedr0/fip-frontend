import { cn } from '@/lib/utils'
import { CalendarDays, Hash } from 'lucide-react'
import type { DateScheduledConditions } from '@/types/automations'

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

interface Props {
  value: DateScheduledConditions | null
  onChange: (conditions: DateScheduledConditions) => void
}

export default function DateScheduledCondition({ value, onChange }: Props) {
  const months = value?.months ?? []

  const toggleMonth = (m: number) => {
    const next = months.includes(m) ? months.filter((x) => x !== m) : [...months, m]
    onChange({ day_of_month: value?.day_of_month ?? 1, months: next })
  }

  return (
    <div className="space-y-5">
      <div className="group">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
          Día del mes (1-28)
        </label>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 shadow-lg shadow-purple-500/20">
              <Hash className="h-3 w-3 text-white" />
            </div>
            <input
              type="number"
              min={1}
              max={28}
              value={value?.day_of_month ?? 1}
              onChange={(e) => onChange({ ...value, day_of_month: Math.min(28, Math.max(1, Number(e.target.value))) } as DateScheduledConditions)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all"
            />
          </div>
          <input
            type="range"
            min={1}
            max={28}
            value={value?.day_of_month ?? 1}
            onChange={(e) => onChange({ ...value, day_of_month: Number(e.target.value) } as DateScheduledConditions)}
            className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer accent-purple-500 bg-gray-200 dark:bg-gray-700"
          />
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600 shadow-lg shadow-indigo-500/20">
            <CalendarDays className="h-3 w-3 text-white" />
          </div>
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Meses</label>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {MONTHS.map((name, idx) => {
            const m = idx + 1
            const isSelected = months.includes(m)
            return (
              <button
                key={m}
                type="button"
                onClick={() => toggleMonth(m)}
                className={cn(
                  'px-3 py-2.5 rounded-xl text-xs font-medium border transition-all duration-200 text-center active:scale-95',
                  isSelected
                    ? 'bg-gradient-to-br from-purple-500 to-indigo-600 border-transparent text-white shadow-lg shadow-purple-500/25 scale-[1.02]'
                    : 'bg-white/80 dark:bg-gray-800/80 border-gray-100/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400 hover:border-purple-200/50 dark:hover:border-purple-500/30 hover:shadow-sm',
                )}
              >
                {name.substring(0, 3)}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
