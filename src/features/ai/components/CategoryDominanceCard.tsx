import type { CategoryDominance } from '@/types/ai'
import { cn } from '@/lib/utils'
import { BarChart3, Activity } from 'lucide-react'

interface CategoryDominanceCardProps {
  category_dominance: Record<string, CategoryDominance> | undefined
  categoryNames?: Record<string, string>
  className?: string
}

function CategoryDominanceCard({ category_dominance, categoryNames = {}, className }: CategoryDominanceCardProps) {
  if (!category_dominance || Object.keys(category_dominance).length === 0) {
    return (
      <div className={cn('rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm', className)}>
        <p className="text-sm text-gray-400">Sin datos de dominancia</p>
      </div>
    )
  }

  const getName = (id: string) => categoryNames[id] || id

  const sorted = Object.entries(category_dominance)
    .sort(([, a], [, b]) => b.share - a.share)
    .slice(0, 5)

  const maxShare = sorted[0]?.[1]?.share ?? 1

  return (
    <div className={cn(
      'rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm transition-all duration-300',
      'hover:shadow-lg hover:-translate-y-0.5 hover:border-gray-200/80 dark:hover:border-gray-600/80',
      className,
    )}>
      <div className="flex items-center gap-2.5 mb-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 shadow-lg shadow-purple-500/20">
          <BarChart3 className="h-4 w-4 text-white" />
        </div>
        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Categorias Dominantes</span>
      </div>

      <div className="space-y-3">
        {sorted.map(([id, dom], i) => (
          <div key={id} className="flex items-center gap-3 group" style={{ animationDelay: `${i * 60}ms` }}>
            <span className="w-24 text-xs text-gray-600 dark:text-gray-400 truncate flex-shrink-0">{getName(id)}</span>
            <div className="flex-1 h-3 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden relative">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-600 transition-all duration-700"
                style={{ width: `${(dom.share / maxShare) * 100}%` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className={cn(
              'text-xs font-bold w-10 text-right',
              dom.is_dominant
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent'
                : 'text-gray-700 dark:text-gray-300',
            )}>
              {(dom.share * 100).toFixed(0)}%
            </span>
            {dom.is_dominant && (
              <Activity className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 animate-pulse" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryDominanceCard
