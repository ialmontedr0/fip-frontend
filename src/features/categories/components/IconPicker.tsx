import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'
import { ICON_CATEGORIES } from '../constants'

interface Props {
  value: string | null
  onChange: (iconName: string | null) => void
}

export default function IconPicker({ value, onChange }: Props) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return ICON_CATEGORIES
    const q = search.toLowerCase()
    return ICON_CATEGORIES.map((cat) => ({
      ...cat,
      icons: cat.icons.filter(
        (item) => item.name.includes(q) || cat.name.toLowerCase().includes(q),
      ),
    })).filter((cat) => cat.icons.length > 0)
  }, [search])

  const displayedCategories = activeCategory
    ? filteredCategories.filter((c) => c.name === activeCategory)
    : filteredCategories

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar iconos..."
          className="w-full rounded-xl border border-gray-200 bg-white/70 py-2 pl-9 pr-3 text-sm backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 placeholder:text-gray-400"
        />
      </div>

      {!search.trim() && (
        <div className="flex gap-1 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveCategory(null)}
            className={cn(
              'whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium transition-all',
              !activeCategory
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400'
                : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800',
            )}
          >
            Todos
          </button>
          {ICON_CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={cn(
                'whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium transition-all',
                activeCategory === cat.name
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400'
                  : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800',
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-8 gap-1.5 max-h-48 overflow-y-auto">
        <button
          onClick={() => onChange(null)}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg border-2 transition-all',
            value === null
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10'
              : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600',
          )}
          title="Sin icono"
        >
          <span className="text-xs text-gray-400 font-bold">X</span>
        </button>
        {displayedCategories.map((cat) =>
          cat.icons.map((item) => {
            const Icon = item.icon
            const isSelected = value === item.name
            return (
              <button
                key={item.name}
                onClick={() => onChange(isSelected ? null : item.name)}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg border-2 transition-all',
                  isSelected
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10 scale-110 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-800',
                )}
                title={item.name}
              >
                <Icon className={cn('h-4 w-4', isSelected ? 'text-primary-600' : 'text-gray-500')} />
              </button>
            )
          }),
        )}
      </div>
    </div>
  )
}
