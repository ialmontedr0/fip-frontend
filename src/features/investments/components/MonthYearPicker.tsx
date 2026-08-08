import { useEffect, useState } from 'react'
import { Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

const selectClass =
  'flex-1 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all'

interface MonthYearPickerProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

function parseValue(value: string): { year: string; month: string } {
  const match = value ? value.match(/^(\d{4})-(\d{2})$/) : null
  return {
    year: match ? match[1] : '',
    month: match ? String(parseInt(match[2], 10)) : '',
  }
}

export default function MonthYearPicker({ value, onChange, className }: MonthYearPickerProps) {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 21 }, (_, i) => currentYear + i)

  const [{ year, month }, setSelection] = useState(() => parseValue(value))

  useEffect(() => {
    setSelection(parseValue(value))
  }, [value])

  const emit = (next: { year?: string; month?: string }) => {
    setSelection((prev) => {
      const selection = { ...prev, ...next }
      if (selection.year && selection.month) {
        onChange(`${selection.year}-${String(parseInt(selection.month, 10)).padStart(2, '0')}`)
      } else {
        onChange('')
      }
      return selection
    })
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Calendar className="h-4 w-4 shrink-0 text-gray-400" />
      <select
        value={month}
        onChange={(e) => emit({ month: e.target.value })}
        className={selectClass}
      >
        <option value="">Mes</option>
        {MONTHS.map((name, i) => (
          <option key={i + 1} value={String(i + 1)}>{name}</option>
        ))}
      </select>
      <select
        value={year}
        onChange={(e) => emit({ year: e.target.value })}
        className={cn(selectClass, 'shrink-0')}
      >
        <option value="">Anio</option>
        {years.map((y) => (
          <option key={y} value={String(y)}>{y}</option>
        ))}
      </select>
    </div>
  )
}
