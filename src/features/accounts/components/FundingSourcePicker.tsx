import { useState, useMemo, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useAccounts } from '../hooks/useAccounts'
import { useCardList } from '@/features/cards/hooks/useCards'
import { useDebitCardList } from '@/features/debitCards/hooks/useDebitCards'
import { Search, ChevronDown, Landmark, CreditCard, Wallet, Building2 } from 'lucide-react'
import { Skeleton } from '@/components/ui'
import { ACCOUNT_TYPE_CONFIG } from '../constants'
import { CARD_NETWORKS } from '@/types/cards'
import type { AccountType } from '@/types/accounts'

export interface FundingSource {
  account_id?: string
  credit_card_id?: string
  debit_card_id?: string
}

interface Props {
  value: FundingSource
  onChange: (source: FundingSource) => void
  error?: string
}

type SourceType = 'account' | 'credit_card' | 'debit_card'

interface SourceItem {
  id: string
  type: SourceType
  name: string
  subtitle?: string
  icon: React.ReactNode
  color: string
}

export default function FundingSourcePicker({ value, onChange, error }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  const { data: acctData, isLoading: acctLoading } = useAccounts()
  const { data: cardData, isLoading: cardLoading } = useCardList()
  const { data: dcData, isLoading: dcLoading } = useDebitCardList()

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const items = useMemo(() => {
    const result: SourceItem[] = []

    const accounts = acctData?.accounts || []
    for (const a of accounts) {
      const cfg = ACCOUNT_TYPE_CONFIG[a.account_type as AccountType]
      const Icon = cfg?.icon || Building2
      result.push({
        id: a.id,
        type: 'account',
        name: a.name,
        subtitle: a.institution || cfg?.label || a.account_type,
        icon: <Icon className={cn('h-4 w-4', cfg?.color)} />,
        color: cfg?.bgColor || 'bg-gray-100',
      })
    }

    const cards = cardData?.cards || []
    for (const c of cards) {
      result.push({
        id: c.id,
        type: 'credit_card',
        name: c.name,
        subtitle: `${CARD_NETWORKS[c.card_network as keyof typeof CARD_NETWORKS] || c.card_network || ''}${c.last_four_digits ? ` ****${c.last_four_digits}` : ''}`,
        icon: <CreditCard className="h-4 w-4 text-white" />,
        color: c.color || 'bg-violet-500',
      })
    }

    const debitCards = dcData?.debit_cards || []
    for (const d of debitCards) {
      result.push({
        id: d.id,
        type: 'debit_card',
        name: d.name,
        subtitle: `${d.card_network?.toUpperCase() || ''}${d.last_four_digits ? ` ****${d.last_four_digits}` : ''}`,
        icon: <Wallet className="h-4 w-4 text-white" />,
        color: d.color || 'bg-emerald-500',
      })
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      return result.filter((i) =>
        i.name.toLowerCase().includes(q) || i.subtitle?.toLowerCase().includes(q)
      )
    }

    return result
  }, [acctData, cardData, dcData, search])

  const selected = useMemo(() => {
    if (value.account_id) {
      const item = items.find((i) => i.type === 'account' && i.id === value.account_id)
      if (item) return { ...item, detail: 'Cuenta' }
    }
    if (value.credit_card_id) {
      const item = items.find((i) => i.type === 'credit_card' && i.id === value.credit_card_id)
      if (item) return { ...item, detail: 'Tarjeta de Credito' }
    }
    if (value.debit_card_id) {
      const item = items.find((i) => i.type === 'debit_card' && i.id === value.debit_card_id)
      if (item) return { ...item, detail: 'Tarjeta de Debito' }
    }
    return null
  }, [items, value])

  const handleSelect = (item: SourceItem) => {
    if (item.type === 'account') {
      onChange({ account_id: item.id })
    } else if (item.type === 'credit_card') {
      onChange({ credit_card_id: item.id })
    } else {
      onChange({ debit_card_id: item.id })
    }
    setIsOpen(false)
  }

  const loading = acctLoading || cardLoading || dcLoading

  return (
    <div ref={ref} className="relative">
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
        {loading ? (
          <Skeleton className="h-4 flex-1" />
        ) : selected ? (
          <>
            <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg shrink-0', selected.color)}>
              {selected.icon}
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{selected.name}</p>
              <p className="text-xs text-gray-400 truncate">{selected.detail}{selected.subtitle ? ` • ${selected.subtitle}` : ''}</p>
            </div>
          </>
        ) : (
          <>
            <Landmark className="h-5 w-5 text-gray-400 shrink-0" />
            <span className="flex-1 text-left text-gray-400">Seleccionar cuenta o tarjeta...</span>
          </>
        )}
        <ChevronDown className={cn('h-4 w-4 text-gray-400 transition-transform shrink-0', isOpen && 'rotate-180')} />
      </button>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

      {isOpen && (
        <div className="absolute z-[9999] mt-1 w-full rounded-xl border border-gray-200 bg-white p-2 shadow-xl backdrop-blur-xl dark:border-gray-700 dark:bg-gray-900">
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar cuenta o tarjeta..."
              className="w-full rounded-lg border border-gray-200 bg-white/70 py-1.5 pl-9 pr-3 text-sm dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          {loading ? (
            <div className="space-y-2 py-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-full rounded-lg" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="py-6 text-center text-sm text-gray-400">
              {search ? 'Sin resultados' : 'No hay cuentas ni tarjetas registradas'}
            </div>
          ) : (
            <div className="max-h-72 overflow-y-auto space-y-0.5">
              {items.map((item) => {
                const isSelected =
                  (item.type === 'account' && item.id === value.account_id) ||
                  (item.type === 'credit_card' && item.id === value.credit_card_id) ||
                  (item.type === 'debit_card' && item.id === value.debit_card_id)
                return (
                  <button
                    key={`${item.type}-${item.id}`}
                    type="button"
                    onClick={() => handleSelect(item)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all',
                      isSelected
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                    )}
                  >
                    <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg shrink-0', item.color)}>
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.name}</p>
                      <p className="text-xs text-gray-400 truncate">
                        {item.type === 'account' ? 'Cuenta' : item.type === 'credit_card' ? 'Tarjeta de Credito' : 'Tarjeta de Debito'}
                        {item.subtitle ? ` • ${item.subtitle}` : ''}
                      </p>
                    </div>
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
