import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TRIGGER_TYPE_OPTIONS } from '../../constants'
import type { TriggerType } from '@/types/automations'

interface StepTriggerTypeProps {
  selected: TriggerType | null
  onSelect: (type: TriggerType) => void
}

export default function StepTriggerType({ selected, onSelect }: StepTriggerTypeProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {TRIGGER_TYPE_OPTIONS.map((opt, index) => {
        const Icon = opt.icon
        const isSelected = selected === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSelect(opt.value)}
            style={{ animationDelay: `${index * 0.08}s` }}
            className={cn(
              'relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-300 text-center backdrop-blur-xl animate-fade-in-up group',
              isSelected
                ? 'border-purple-500 ring-2 ring-purple-500/30 scale-[1.02] shadow-lg shadow-purple-500/10'
                : 'border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 hover:shadow-lg hover:-translate-y-0.5 hover:border-purple-200/50 dark:hover:border-purple-500/30',
            )}
          >
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg text-white transition-all duration-300',
                opt.gradient,
                isSelected ? 'shadow-lg shadow-purple-500/20' : '',
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <div
                className={cn(
                  'text-sm font-semibold transition-colors duration-200',
                  isSelected
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent'
                    : 'text-gray-700 dark:text-gray-300',
                )}
              >
                {opt.label}
              </div>
              <div
                className={cn(
                  'text-[10px] leading-tight mt-0.5 transition-all duration-300',
                  isSelected ? 'text-purple-400/70' : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-400',
                )}
              >
                {opt.description}
              </div>
            </div>
            {isSelected && (
              <div className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/30 animate-fade-in">
                <Check className="h-3 w-3" />
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}
