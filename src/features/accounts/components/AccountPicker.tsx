import { useState, useMemo, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useAccounts } from '../hooks/useAccounts'
import { Search, ChevronDown } from 'lucide-react'
import { Skeleton } from '@/components/ui'
import { ACCOUNT_TYPE_CONFIG } from '../constants'
import type { AccountType } from '@/types/accounts'

interface Props {
  value: string
  onChange: (id: string) => void
  error?: string
  placeholder?: string
  className?: string
}

export default function AccountPicker({ value, onChange, error, placeholder = 'Seleccionar cuenta...', className }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const { data, isLoading } = useAccounts()

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const accounts = data?.accounts || []
  const filtered = useMemo(() => {
    if (!search.trim()) return accounts
    const q = search.toLowerCase()
    return accounts.filter((a) =>
      a.name.toLowerCase().includes(q) ||
      a.institution?.toLowerCase().includes(q)
    )
  }, [accounts, search])

  const selected = accounts.find((a) => a.id === value)
  const selectedConfig = selected ? ACCOUNT_TYPE_CONFIG[selected.account_type as AccountType] : null
  const SelectedIcon = selectedConfig?.icon

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex w-full items-center gap-3 rounded-xl border px-4 py-2.5 text-sm backdrop-blur-sm transition-all',
          'bg-white/70 dark:bg-gray-800/70 dark:text-gray-200',
          'border-gray-200 dark:border-gray-700',
          'focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20',
          isOpen && 'border-primary-400 ring-2 ring-primary-500/20',
          error && 'border-red-400 ring-2 ring-red-500/20',
        )}
      >
        {isLoading ? (
          <div className="flex items-center gap-2 flex-1">
            <Skeleton className="h-6 w-6 rounded-lg" />
            <Skeleton className="h-4 flex-1" />
          </div>
        ) : selected && selectedConfig ? (
          <>
            <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', selectedConfig.bgColor)}>
              {SelectedIcon && <SelectedIcon className={cn('h-4 w-4', selectedConfig.color)} />}
            </div>
            <span className="flex-1 text-left font-medium text-gray-900 dark:text-gray-100 truncate">
              {selected.name}
            </span>
            <span className="text-xs text-gray-400">{selected.institution || ''}</span>
          </>
        ) : (
          <span className="flex-1 text-left text-gray-400">{placeholder}</span>
        )}
        <ChevronDown className={cn('h-4 w-4 text-gray-400 transition-transform shrink-0', isOpen && 'rotate-180')} />
      </button>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white p-2 shadow-xl backdrop-blur-xl dark:border-gray-700 dark:bg-gray-900">
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar cuenta..."
              className="w-full rounded-lg border border-gray-200 bg-white/70 py-1.5 pl-9 pr-3 text-sm dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          {filtered.length === 0 && (
            <div className="py-6 text-center text-sm text-gray-400">
              {search ? 'Sin resultados' : 'No hay cuentas'}
            </div>
          )}

          {filtered.length > 0 && (
            <div className="max-h-60 overflow-y-auto space-y-0.5">
              {filtered.map((account) => {
                const config = ACCOUNT_TYPE_CONFIG[account.account_type as AccountType]
                const Icon = config?.icon
                return (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => { onChange(account.id); setIsOpen(false) }}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all',
                      value === account.id
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                    )}
                  >
                    {Icon && (
                      <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', config?.bgColor)}>
                        <Icon className={cn('h-4 w-4', config?.color)} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{account.name}</p>
                      {account.institution && (
                        <p className="text-xs text-gray-400">{account.institution}</p>
                      )}
                    </div>
                    <span className={cn('text-xs font-medium', config?.color)}>{config?.label}</span>
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
