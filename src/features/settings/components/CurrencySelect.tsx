import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { DollarSign, ChevronDown, Search } from 'lucide-react'

interface CurrencySelectProps {
  value: string
  onChange: (value: string) => void
  currencies: string[]
}

const CURRENCY_NAMES: Record<string, string> = {
  DOP: 'Peso Dominicano',
  USD: 'D\u00f3lar Estadounidense',
  EUR: 'Euro',
  GBP: 'Libra Esterlina',
  JPY: 'Yen Japon\u00e9s',
  CAD: 'D\u00f3lar Canadiense',
  BRL: 'Real Brasile\u00f1o',
  MXN: 'Peso Mexicano',
  ARS: 'Peso Argentino',
  COP: 'Peso Colombiano',
  CLP: 'Peso Chileno',
  PEN: 'Sol Peruano',
  UYU: 'Peso Uruguayo',
  PYG: 'Guaran\u00ed Paraguayo',
  BOB: 'Boliviano',
  VES: 'Bol\u00edvar Venezolano',
  CRC: 'Col\u00f3n Costarricense',
  GTQ: 'Quetzal Guatemalteco',
}

function getCurrencySymbol(code: string): string {
  const symbols: Record<string, string> = {
    DOP: 'RD$', USD: '$', EUR: '\u20ac', GBP: '\u00a3',
    JPY: '\u00a5', CAD: 'C$', BRL: 'R$', MXN: 'MX$',
    ARS: 'ARS$', COP: 'COL$', CLP: 'CLP$', PEN: 'S/',
    UYU: '$U', PYG: '\u20b2', BOB: 'Bs', VES: 'Bs.S',
    CRC: '\u20a1', GTQ: 'Q',
  }
  return symbols[code] || code
}

export default function CurrencySelect({ value, onChange, currencies }: CurrencySelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const filtered = currencies.filter(
    (c) => c.toLowerCase().includes(search.toLowerCase()) ||
      (CURRENCY_NAMES[c] || '').toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all"
      >
        <DollarSign className="h-4 w-4 text-gray-400 shrink-0" />
        <span className="font-semibold text-gray-900 dark:text-white">{getCurrencySymbol(value)}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">{value}</span>
        <ChevronDown className={cn('h-4 w-4 text-gray-400 ml-auto transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-40 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl backdrop-blur-xl overflow-hidden">
          <div className="p-2 border-b border-gray-100 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar moneda..."
                className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/30"
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto p-1">
            {filtered.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => { onChange(code); setOpen(false); setSearch('') }}
                className={cn(
                  'flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                  code === value
                    ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50',
                )}
              >
                <span className="font-semibold w-10 text-gray-900 dark:text-white">{getCurrencySymbol(code)}</span>
                <span className="flex-1 text-left">{CURRENCY_NAMES[code] || code}</span>
                <span className="text-xs font-mono text-gray-400">{code}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">Sin resultados</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
