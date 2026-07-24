import { cn } from '@/lib/utils'
import CategoryBadge from './CategoryBadge'
import CategoryTypeBadge from './CategoryTypeBadge'
import { ChevronRight } from 'lucide-react'
import type { CategoryListItem, SubcategoryListItem } from '@/types/categories'

interface Props {
  categories: CategoryListItem[]
  onSelect?: (id: string) => void
  selectedId?: string
  showType?: boolean
}

export function CategoryTreeSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2 rounded-xl px-3 py-2.5">
          <div className="h-5 w-24 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>
      ))}
    </div>
  )
}

export default function CategoryTree({ categories, onSelect, selectedId, showType }: Props) {
  if (categories.length === 0) return null

  return (
    <div className="space-y-1">
      {categories.map((cat) => (
        <div key={cat.id} className="animate-fade-in" style={{ animationFillMode: 'both' }}>
          <div
            onClick={() => onSelect?.(cat.id)}
            className={cn(
              'group flex items-center gap-2 rounded-xl px-3 py-2.5 transition-all duration-200 cursor-pointer',
              'hover:bg-white/50 dark:hover:bg-gray-800/50',
              selectedId === cat.id && 'bg-primary-50/50 dark:bg-primary-500/10',
            )}
          >
            <CategoryBadge
              name={cat.name}
              icon={cat.icon}
              color={cat.color}
              isSystem={cat.is_system}
              size="sm"
            />
            {showType && <CategoryTypeBadge type={cat.category_type} showLabel={false} />}
          </div>

          {cat.subcategories.length > 0 && (
            <div className="ml-6 mt-0.5 space-y-0.5 border-l-2 border-gray-100 pl-3 dark:border-gray-800">
              {cat.subcategories.map((sub) => (
                <SubcategoryRow
                  key={sub.id}
                  sub={sub}
                  onSelect={onSelect}
                  selectedId={selectedId}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function SubcategoryRow({ sub, onSelect, selectedId }: { sub: SubcategoryListItem; onSelect?: (id: string) => void; selectedId?: string }) {
  return (
    <div
      onClick={() => onSelect?.(sub.id)}
      className={cn(
        'group flex items-center gap-2 rounded-lg px-3 py-1.5 transition-all duration-200 cursor-pointer',
        'hover:bg-gray-50 dark:hover:bg-gray-800/50',
        selectedId === sub.id && 'bg-primary-50/30 dark:bg-primary-500/5',
      )}
    >
      <ChevronRight className="h-3 w-3 shrink-0 text-gray-300" />
      <CategoryBadge
        name={sub.name}
        icon={sub.icon}
        color={sub.color}
        size="sm"
      />
    </div>
  )
}
