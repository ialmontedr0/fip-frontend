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

export default function MonthYearPicker({ value, onChange, className }: MonthYearPickerProps) {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 21 }, (_, i) => currentYear + i)

  const match = value ? value.match(/^(\d{4})-(\d{2})$/) : null
  const selectedYear = match ? match[1] : ''
  const selectedMonth = match ? String(parseInt(match[2], 10)) : ''

  const emit = (year: string, month: string) => {
    if (year && month) {
      onChange(`${year}-${String(parseInt(month, 10)).padStart(2, '0')}`)
    } else {
      onChange('')
    }
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Calendar className="h-4 w-4 shrink-0 text-gray-400" />
      <select
        value={selectedMonth}
        onChange={(e) => emit(selectedYear, e.target.value)}
        className={selectClass}
      >
        <option value="">Mes</option>
        {MONTHS.map((name, i) => (
          <option key={i + 1} value={String(i + 1)}>{name}</option>
        ))}
      </select>
      <select
        value={selectedYear}
        onChange={(e) => emit(e.target.value, selectedMonth)}
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
