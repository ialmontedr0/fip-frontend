import { useState, useMemo, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn, formatCurrency } from '@/lib/utils'
import { Search, ChevronDown, Loader2 } from 'lucide-react'

export interface CombinedOption {
  id: string
  label: string
  type: 'template' | 'service' | 'subscription'
  amount?: string | null
  category?: string | null
  category_id?: string | null
  account_id?: string | null
  account_name?: string | null
  notes?: string | null
  description?: string | null
}

interface Props {
  value: string
  onChange: (value: string | null) => void
  options: CombinedOption[]
  isLoading?: boolean
  placeholder?: string
  className?: string
}

const TYPE_CONFIG = {
  template: { label: 'Plantilla', class: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300' },
  service: { label: 'Servicio', class: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300' },
  subscription: { label: 'Suscripcion', class: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300' },
}

export default function TemplatePicker({ value, onChange, options, isLoading, placeholder = 'Seleccionar...', className }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const buttonRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  const filtered = useMemo(() => {
    if (!search.trim()) return options
    const q = search.toLowerCase()
    return options.filter((o) => o.label.toLowerCase().includes(q))
  }, [options, search])

  const selected = options.find((o) => o.id === value)

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
        )}
      >
        {isLoading ? (
          <span className="flex items-center gap-2 text-gray-400 flex-1 text-left">
            <Loader2 className="h-4 w-4 animate-spin" />
            Cargando...
          </span>
        ) : selected ? (
          <div className="flex items-center gap-2 flex-1 min-w-0 text-left">
            <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-bold uppercase leading-tight shrink-0', TYPE_CONFIG[selected.type].class)}>
              {TYPE_CONFIG[selected.type].label}
            </span>
            <span className="truncate font-medium text-gray-900 dark:text-gray-100">{selected.label.replace(/^\[(Plantilla|Servicio|Suscripcion)\]\s*/, '')}</span>
            {selected.amount && (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 shrink-0 ml-auto">
                {formatCurrency(parseFloat(selected.amount))}
              </span>
            )}
          </div>
        ) : (
          <span className="text-gray-400 flex-1 text-left">{placeholder}</span>
        )}
        {!isLoading && (
          <ChevronDown className={cn('h-4 w-4 text-gray-400 transition-transform shrink-0', isOpen && 'rotate-180')} />
        )}
      </button>

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
              placeholder="Buscar..."
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
                {search ? <p>Sin resultados para "{search}"</p> : <p>No hay opciones disponibles</p>}
              </div>
            )}

            {!isLoading && filtered.length > 0 && (
              filtered.map((opt) => {
                const cfg = TYPE_CONFIG[opt.type]
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => { onChange(opt.id); setIsOpen(false) }}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all',
                      value === opt.id
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                    )}
                  >
                    <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-bold uppercase leading-tight shrink-0', cfg.class)}>
                      {cfg.label}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{opt.label.replace(/^\[(Plantilla|Servicio|Suscripcion)\]\s*/, '')}</p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        {opt.category && <span className="text-[10px] text-gray-400">{opt.category}</span>}
                        {opt.account_name && <span className="text-[10px] text-gray-400">{opt.account_name}</span>}
                      </div>
                    </div>
                    {opt.amount && (
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(parseFloat(opt.amount))}
                        </p>
                      </div>
                    )}
                  </button>
                )
              })
            )}
          </div>
        </div>,
        document.body,
      )}
    </div>
  )
}
