import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Globe, ChevronDown, Search } from 'lucide-react'

interface TimezoneSelectProps {
  value: string
  onChange: (value: string) => void
  timezones: string[]
}

export default function TimezoneSelect({ value, onChange, timezones }: TimezoneSelectProps) {
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

  const grouped = timezones.reduce(
    (acc, tz) => {
      const region = tz.split('/')[0] || 'Otros'
      if (!acc[region]) acc[region] = []
      acc[region].push(tz)
      return acc
    },
    {} as Record<string, string[]>,
  )

  const filteredSearch = search.toLowerCase()
  const filtered = Object.entries(grouped).reduce(
    (acc, [region, tzs]) => {
      const matched = tzs.filter(
        (tz) =>
          tz.toLowerCase().includes(filteredSearch) ||
          region.toLowerCase().includes(filteredSearch),
      )
      if (matched.length > 0) acc[region] = matched
      return acc
    },
    {} as Record<string, string[]>,
  )

  const displayValue = value.replace(/_/g, ' ').replace(/\//g, ' / ')

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all"
      >
        <Globe className="h-4 w-4 text-gray-400 shrink-0" />
        <span className="text-xs text-gray-900 dark:text-white font-medium truncate flex-1 text-left">{displayValue}</span>
        <ChevronDown className={cn('h-4 w-4 text-gray-400 shrink-0 transition-transform', open && 'rotate-180')} />
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
                placeholder="Buscar zona horaria..."
                className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/30"
              />
            </div>
          </div>
          <div className="max-h-72 overflow-y-auto p-1">
            {Object.entries(filtered).length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">Sin resultados</p>
            ) : (
              Object.entries(filtered).map(([region, tzs]) => (
                <div key={region}>
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    {region}
                  </div>
                  {tzs.map((tz) => (
                    <button
                      key={tz}
                      type="button"
                      onClick={() => { onChange(tz); setOpen(false); setSearch('') }}
                      className={cn(
                        'flex w-full items-center gap-3 px-3 py-2 rounded-lg text-xs transition-colors',
                        tz === value
                          ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-300'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50',
                      )}
                    >
                      <span className="font-mono">{tz}</span>
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
