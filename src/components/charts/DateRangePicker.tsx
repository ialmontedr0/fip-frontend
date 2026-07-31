import { useState, useRef, useEffect } from 'react'
import { CalendarDays, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DateRangePreset {
  label: string
  getValue: () => { start: string; end: string }
}

interface DateRangePickerProps {
  startDate: string
  endDate: string
  onChange: (start: string, end: string) => void
  presets?: DateRangePreset[]
}

const DEFAULT_PRESETS: DateRangePreset[] = [
  {
    label: 'Este Mes',
    getValue: () => {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      return { start: start.toISOString().slice(0, 10), end: now.toISOString().slice(0, 10) }
    },
  },
  {
    label: 'Mes Pasado',
    getValue: () => {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const end = new Date(now.getFullYear(), now.getMonth(), 0)
      return { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) }
    },
  },
  {
    label: 'Ultimos 30 Dias',
    getValue: () => {
      const end = new Date()
      const start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000)
      return { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) }
    },
  },
  {
    label: 'Ultimos 90 Dias',
    getValue: () => {
      const end = new Date()
      const start = new Date(end.getTime() - 90 * 24 * 60 * 60 * 1000)
      return { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) }
    },
  },
  {
    label: 'Este Ano',
    getValue: () => {
      const now = new Date()
      const start = new Date(now.getFullYear(), 0, 1)
      return { start: start.toISOString().slice(0, 10), end: now.toISOString().slice(0, 10) }
    },
  },
]

function findActiveLabel(startDate: string, endDate: string, presets: DateRangePreset[]): string {
  for (const preset of presets) {
    const { start, end } = preset.getValue()
    if (start === startDate && end === endDate) {
      return preset.label
    }
  }
  return `${startDate} - ${endDate}`
}

function DateRangePicker({
  startDate,
  endDate,
  onChange,
  presets = DEFAULT_PRESETS,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [customStart, setCustomStart] = useState(startDate)
  const [customEnd, setCustomEnd] = useState(endDate)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const activeLabel = findActiveLabel(startDate, endDate, presets)

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm',
          'dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200',
          'hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors',
        )}
      >
        <CalendarDays className="h-4 w-4 text-gray-400" />
        <span className="text-gray-700 dark:text-gray-300">{activeLabel}</span>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-2 w-72 rounded-lg border border-gray-200 bg-white p-4 shadow-lg',
            'dark:border-gray-700 dark:bg-gray-800',
            'left-0 sm:left-auto sm:right-0',
            'animate-fade-in',
          )}
        >
          <div className="mb-3 space-y-2">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Periodos rapidos
            </p>
            <div className="grid grid-cols-2 gap-1">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    const { start, end } = preset.getValue()
                    onChange(start, end)
                    setIsOpen(false)
                  }}
                  className={cn(
                    'rounded-md px-2 py-1.5 text-left text-sm transition-colors',
                    'hover:bg-gray-100 dark:hover:bg-gray-700',
                    activeLabel === preset.label
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                      : 'text-gray-600 dark:text-gray-400',
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-3 dark:border-gray-700">
            <p className="mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Personalizado
            </p>
            <div className="space-y-2">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Desde</label>
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className={cn(
                    'w-full rounded-md border border-gray-200 bg-white px-2 py-1.5 text-sm',
                    'dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200',
                  )}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Hasta</label>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className={cn(
                    'w-full rounded-md border border-gray-200 bg-white px-2 py-1.5 text-sm',
                    'dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200',
                  )}
                />
              </div>
              <button
                onClick={() => {
                  onChange(customStart, customEnd)
                  setIsOpen(false)
                }}
                className="w-full rounded-md bg-primary-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DateRangePicker
