import { cn } from '@/lib/utils'
import { NOTIFICATION_TYPE_OPTIONS, CHANNEL_OPTIONS, READ_STATUS_OPTIONS } from '../constants'

interface NotificationFiltersProps {
  typeFilter: string
  onTypeFilterChange: (value: string) => void
  channelFilter: string
  onChannelFilterChange: (value: string) => void
  readFilter: string
  onReadFilterChange: (value: string) => void
}

function FilterSelect({ value, onChange, options, placeholder }: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  placeholder: string
}) {
  return (
    <div className="relative group">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl px-4 py-2 pr-9 text-xs font-semibold text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400/50 cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 group-hover:-translate-y-0.5"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 transition-transform duration-200 group-hover:translate-y-[-50%] group-hover:scale-110" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
      </svg>
    </div>
  )
}

export default function NotificationFilters({
  typeFilter, onTypeFilterChange,
  channelFilter, onChannelFilterChange,
  readFilter, onReadFilterChange,
}: NotificationFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Read status pills */}
      <div className="inline-flex items-center rounded-2xl border border-gray-100/80 dark:border-gray-700/60 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-1 shadow-sm gap-0.5">
        {READ_STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onReadFilterChange(opt.value)}
            className={cn(
              'relative rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all duration-200',
              readFilter === opt.value
                ? 'text-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
            )}
          >
            {readFilter === opt.value && (
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 shadow-md shadow-purple-500/20 animate-fade-in" />
            )}
            <span className="relative z-10">{opt.label}</span>
          </button>
        ))}
      </div>

      {/* Type/Channel selects */}
      <FilterSelect
        value={typeFilter}
        onChange={(v) => { onTypeFilterChange(v); }}
        options={NOTIFICATION_TYPE_OPTIONS}
        placeholder="Todos los tipos"
      />
      <FilterSelect
        value={channelFilter}
        onChange={(v) => { onChannelFilterChange(v); }}
        options={CHANNEL_OPTIONS}
        placeholder="Todos los canales"
      />

      {/* Active filter indicator */}
      {(typeFilter || channelFilter || readFilter) && (
        <button
          onClick={() => { onTypeFilterChange(''); onChannelFilterChange(''); onReadFilterChange('') }}
          className="inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all active:scale-95"
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Limpiar
        </button>
      )}
    </div>
  )
}
