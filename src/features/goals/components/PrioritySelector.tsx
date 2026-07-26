import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'

interface PrioritySelectorProps {
  value: number
  onChange?: (priority: number) => void
  readonly?: boolean
  size?: 'sm' | 'md'
}

const priorityColors = [
  'text-gray-300 dark:text-gray-600',
  'text-blue-400',
  'text-emerald-500',
  'text-amber-500',
  'text-red-500',
]

const priorityLabels = ['', 'Muy Baja', 'Baja', 'Normal', 'Alta', 'Critica']

export default function PrioritySelector({ value, onChange, readonly = false, size = 'sm' }: PrioritySelectorProps) {
  const starSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'
  const gap = size === 'sm' ? 'gap-0.5' : 'gap-1'

  return (
    <div className="flex items-center gap-2">
      <div className={cn('flex items-center', gap)}>
        {[1, 2, 3, 4, 5].map((level) => (
          <button
            key={level}
            type="button"
            disabled={readonly}
            onClick={() => onChange?.(level)}
            className={cn(
              'transition-all duration-200',
              readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110',
              level <= value ? priorityColors[level - 1] : 'text-gray-300 dark:text-gray-600',
            )}
            aria-label={`Prioridad ${level}`}
          >
            <Star className={cn(starSize, level <= value ? 'fill-current' : '')} />
          </button>
        ))}
      </div>
      {value > 0 && (
        <span className={cn('text-xs font-medium', priorityColors[value - 1])}>
          {priorityLabels[value]}
        </span>
      )}
    </div>
  )
}
