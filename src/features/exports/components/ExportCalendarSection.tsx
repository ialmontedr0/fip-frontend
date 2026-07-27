import { Calendar, Download } from 'lucide-react'

interface ExportCalendarSectionProps {
  endpoint: string
  label: string
  onExport: (endpoint: string) => void
  disabled?: boolean
}

export default function ExportCalendarSection({ endpoint, label, onExport, disabled }: ExportCalendarSectionProps) {
  return (
    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
            <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-white">Calendario (.ics)</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{label}</p>
          </div>
        </div>
        <button
          onClick={() => onExport(endpoint)}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-50"
        >
          <Download className="h-3.5 w-3.5" />
          Exportar
        </button>
      </div>
    </div>
  )
}
