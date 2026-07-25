import { useState, useMemo, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn, formatCurrency } from '@/lib/utils'
import { useSources } from '../hooks/useSources'
import { Search, ChevronDown, Plus, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import StabilityBadge from './StabilityBadge'
import IncomeTypeBadge from './IncomeTypeBadge'
import type { SourceResponse } from '@/types/incomes'

interface Props {
  value: string
  onChange: (sourceId: string) => void
  filterType?: string
  placeholder?: string
  className?: string
  allowClear?: boolean
  error?: string
}

export default function IncomeSourcePicker({ value, onChange, filterType, placeholder = 'Seleccionar fuente...', className, allowClear = true, error }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const buttonRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { data, isLoading } = useSources(filterType ? { income_type: filterType } : undefined)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        buttonRef.current && !buttonRef.current.contains(e.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node)
      ) setIsOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (isOpen && dropdownRef.current && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const dropdownHeight = Math.min(360, spaceBelow - 8)

      dropdownRef.current.style.position = 'fixed'
      dropdownRef.current.style.top = `${rect.bottom + 4}px`
      dropdownRef.current.style.left = `${rect.left}px`
      dropdownRef.current.style.width = `${rect.width}px`
      dropdownRef.current.style.maxHeight = `${dropdownHeight}px`
    }
  }, [isOpen])

  const sources = useMemo(() => {
    if (!data?.sources) return []
    return data.sources
  }, [data])

  const filtered = useMemo(() => {
    if (!search.trim()) return sources
    const q = search.toLowerCase()
    return sources.filter((s) => s.name.toLowerCase().includes(q))
  }, [sources, search])

  const selected = sources.find((s) => s.id === value)

  return (
    <div ref={buttonRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex w-full items-center gap-2 rounded-xl border bg-white/70 px-3 py-2.5 text-sm backdrop-blur-sm transition-all',
          'dark:bg-gray-800/70 dark:text-gray-200',
          'border-gray-200 dark:border-gray-700',
          'focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20',
          isOpen && 'border-primary-400 ring-2 ring-primary-500/20',
          error && 'border-red-400 ring-2 ring-red-500/20',
        )}
      >
        {isLoading ? (
          <span className="flex items-center gap-2 text-gray-400 flex-1 text-left">
            <Loader2 className="h-4 w-4 animate-spin" />
            Cargando...
          </span>
        ) : selected ? (
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate flex-1 text-left">
            {selected.name}
          </span>
        ) : (
          <span className="text-gray-400 flex-1 text-left">{placeholder}</span>
        )}
        {allowClear && selected && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange('') }}
            className="rounded p-0.5 text-gray-300 hover:text-gray-500 dark:hover:text-gray-300 z-10"
          >
            <span className="text-lg leading-none">&times;</span>
          </button>
        )}
        {!selected && (
          <ChevronDown className={cn('h-4 w-4 text-gray-400 transition-transform shrink-0', isOpen && 'rotate-180')} />
        )}
      </button>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

      {isOpen && createPortal(
        <div
          ref={dropdownRef}
          className="z-[9999] rounded-xl border border-gray-200 bg-white p-2 shadow-2xl backdrop-blur-xl dark:border-gray-700 dark:bg-gray-900 overflow-hidden flex flex-col"
          style={{ position: 'fixed' }}
        >
          <div className="relative mb-2 shrink-0">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar fuente..."
              className="w-full rounded-lg border border-gray-200 bg-white/70 py-1.5 pl-9 pr-3 text-sm dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20"
              autoFocus
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-0.5 min-h-0">
            {isLoading && (
              <div className="flex items-center justify-center py-8 text-sm text-gray-400">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Cargando...
              </div>
            )}

            {!isLoading && filtered.length === 0 && (
              <div className="py-8 text-center text-sm text-gray-400">
                {search ? (
                  <p>Sin resultados para "{search}"</p>
                ) : (
                  <div className="space-y-3">
                    <p>No hay fuentes de ingreso</p>
                    <button
                      type="button"
                      onClick={() => { navigate('/incomes/sources/new'); setIsOpen(false) }}
                      className="inline-flex items-center gap-1.5 text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Crear Fuente
                    </button>
                  </div>
                )}
              </div>
            )}

            {!isLoading && filtered.length > 0 && (
              filtered.map((source: SourceResponse) => (
                <button
                  key={source.id}
                  type="button"
                  onClick={() => { onChange(source.id); setIsOpen(false) }}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all',
                    value === source.id
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{source.name}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <IncomeTypeBadge type={source.income_type} size="sm" showIcon={false} />
                      <StabilityBadge stability={source.stability} size="sm" />
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(source.total_received)}
                    </p>
                    <p className="text-[10px] text-gray-400">{source.income_count} ingresos</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>,
        document.body,
      )}
    </div>
  )
}
