import { cn } from '@/lib/utils'
import { taxCategoryColor } from '@/types/taxes'

interface CategoryBadgeProps {
  name: string | null
}

export default function CategoryBadge({ name }: CategoryBadgeProps) {
  if (!name) return null
  const color = name === 'Sin categoría' ? '#6b7280' : taxCategoryColor(name)

  return (
    <span
      className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium')}
      style={{ backgroundColor: `${color}26`, color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {name}
    </span>
  )
}
