import { useState, useMemo, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useCategories } from '../hooks/useCategories'
import CategoryBadge from './CategoryBadge'
import { Search, ChevronDown, ChevronRight } from 'lucide-react'
import type { CategoryListItem } from '@/types/categories'
import { CATEGORY_TYPE_CONFIG } from '../constants'

interface Props {
  value: string
  onChange: (categoryId: string, subcategoryId?: string) => void
  filterType?: 'expense' | 'income' | 'transfer' | 'adjustment'
  placeholder?: string
  className?: string
  allowClear?: boolean
}

interface FlatItem {
  id: string
  name: string
  icon: string | null
  color: string | null
  is_system: boolean
  category_type: string
  depth: number
  parentId?: string
}

function flattenItems(categories: CategoryListItem[]): FlatItem[] {
  const result: FlatItem[] = []
  for (const cat of categories) {
    result.push({
      id: cat.id, name: cat.name, icon: cat.icon, color: cat.color,
      is_system: cat.is_system, category_type: cat.category_type, depth: 0,
    })
    for (const sub of cat.subcategories) {
      result.push({
        id: sub.id, name: sub.name, icon: sub.icon, color: sub.color,
        is_system: false, category_type: cat.category_type, depth: 1,
        parentId: cat.id,
      })
    }
  }
  return result
}

export default function CategoryPicker({ value, onChange, filterType, placeholder = 'Seleccionar categoria...', className, allowClear = true }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const { data, isLoading } = useCategories(filterType ? { category_type: filterType } : undefined)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const allItems = useMemo(() => {
    if (!data?.categories) return []
    return flattenItems(data.categories)
  }, [data])

  const filtered = useMemo(() => {
    if (!search.trim()) return allItems
    const q = search.toLowerCase()
    return allItems.filter((item) => item.name.toLowerCase().includes(q))
  }, [allItems, search])

  const selected = allItems.find((item) => item.id === value)

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex w-full items-center gap-2 rounded-xl border border-gray-200 bg-white/70 px-3 py-2.5 text-sm backdrop-blur-sm transition-all',
          'dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-200',
          'focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20',
          isOpen && 'border-primary-400 ring-2 ring-primary-500/20',
        )}
      >
        {selected ? (
          <CategoryBadge name={selected.name} icon={selected.icon} color={selected.color} isSystem={selected.is_system} size="sm" />
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
        {allowClear && selected && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange('', ''); }}
            className="ml-auto rounded p-0.5 text-gray-300 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <span className="text-xs">&times;</span>
          </button>
        )}
        {!selected && (
          <ChevronDown className={cn('ml-auto h-4 w-4 text-gray-400 transition-transform', isOpen && 'rotate-180')} />
        )}
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white p-2 shadow-xl backdrop-blur-xl dark:border-gray-700 dark:bg-gray-900">
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar categoria..."
              className="w-full rounded-lg border border-gray-200 bg-white/70 py-1.5 pl-9 pr-3 text-sm dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          {isLoading && (
            <div className="py-6 text-center text-sm text-gray-400">Cargando...</div>
          )}

          {!isLoading && filtered.length === 0 && (
            <div className="py-6 text-center text-sm text-gray-400">
              {search ? 'Sin resultados' : 'No hay categorias'}
            </div>
          )}

          {!isLoading && filtered.length > 0 && (
            <div className="max-h-60 overflow-y-auto">
              {filtered.map((item) => {
                const config = CATEGORY_TYPE_CONFIG[item.category_type as keyof typeof CATEGORY_TYPE_CONFIG]
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (item.depth === 0) {
                        onChange(item.id)
                      } else {
                        onChange(item.parentId!, item.id)
                      }
                      setIsOpen(false)
                    }}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-all',
                      value === item.id
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                    )}
                    style={{ paddingLeft: `${12 + item.depth * 16}px` }}
                  >
                    {item.depth > 0 && <ChevronRight className="h-3 w-3 shrink-0 text-gray-300" />}
                    <CategoryBadge name={item.name} icon={item.icon} color={item.color} isSystem={item.is_system} size="sm" />
                    {config && (
                      <span className={cn('ml-auto text-[10px] font-medium', config.color)}>
                        {config.label}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
