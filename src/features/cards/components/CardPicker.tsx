import { useState, useMemo, useRef, useEffect } from 'react'
import { cn, formatCurrency } from '@/lib/utils'
import { useCardList } from '../hooks/useCards'
import { Search, ChevronDown, CreditCard } from 'lucide-react'
import { Skeleton } from '@/components/ui'
import { CARD_NETWORKS } from '@/types/cards'

const NETWORK_COLORS: Record<string, string> = {
  visa: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
  mastercard: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
  amex: 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300',
}

interface Props {
  value: string
  onChange: (id: string) => void
  error?: string
  placeholder?: string
  className?: string
}

export default function CardPicker({ value, onChange, error, placeholder = 'Seleccionar tarjeta...', className }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const { data, isLoading } = useCardList()

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const cards = data?.cards || []
  const filtered = useMemo(() => {
    if (!search.trim()) return cards
    const q = search.toLowerCase()
    return cards.filter((c) =>
      c.name.toLowerCase().includes(q) ||
      c.card_network?.toLowerCase().includes(q) ||
      c.last_four_digits?.includes(q)
    )
  }, [cards, search])

  const selected = cards.find((c) => c.id === value)

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
          <Skeleton className="h-4 flex-1" />
        ) : selected ? (
          <>
            <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', selected.color || 'bg-gray-100')}>
              <CreditCard className="h-4 w-4 text-white" />
            </div>
            <span className="flex-1 text-left font-medium text-gray-900 dark:text-gray-100 truncate">
              {selected.name}
            </span>
            {selected.card_network && (
              <span className={cn('text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded', NETWORK_COLORS[selected.card_network] || 'bg-gray-100 text-gray-500')}>
                {CARD_NETWORKS[selected.card_network as keyof typeof CARD_NETWORKS] || selected.card_network}
              </span>
            )}
            {selected.last_four_digits && (
              <span className="text-xs text-gray-400">****{selected.last_four_digits}</span>
            )}
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
              placeholder="Buscar tarjeta..."
              className="w-full rounded-lg border border-gray-200 bg-white/70 py-1.5 pl-9 pr-3 text-sm dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          {filtered.length === 0 && (
            <div className="py-6 text-center text-sm text-gray-400">
              {search ? 'Sin resultados' : 'No hay tarjetas registradas'}
            </div>
          )}

          {filtered.length > 0 && (
            <div className="max-h-60 overflow-y-auto space-y-0.5">
              {filtered.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => { onChange(card.id); setIsOpen(false) }}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all',
                    value === card.id
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                  )}
                >
                  <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg shrink-0', card.color || 'bg-gray-200')}>
                    <CreditCard className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{card.name}</p>
                    {card.card_network && (
                      <p className="text-xs text-gray-400">{CARD_NETWORKS[card.card_network as keyof typeof CARD_NETWORKS] || card.card_network}{card.last_four_digits ? ` • ****${card.last_four_digits}` : ''}</p>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">
                    {card.credit_limit ? formatCurrency(parseFloat(card.credit_limit), card.currency_code) : ''}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
