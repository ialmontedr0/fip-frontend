import { cn } from '@/lib/utils'
import { FileSpreadsheet, FileText, Download } from 'lucide-react'
import { EXPORT_FORMAT_OPTIONS } from '@/types/exports'
import type { ExportFormat } from '@/types/exports'

interface ExportFormatSelectorProps {
  formats: ExportFormat[]
  onSelect: (format: ExportFormat) => void
  disabled?: boolean
}

const FORMAT_ICONS: Record<string, typeof FileSpreadsheet> = {
  csv: FileSpreadsheet, xlsx: FileSpreadsheet, pdf: FileText,
}

export default function ExportFormatSelector({ formats, onSelect, disabled }: ExportFormatSelectorProps) {
  const availableOptions = EXPORT_FORMAT_OPTIONS.filter((opt) => formats.includes(opt.value))

  return (
    <div className="space-y-3">
      <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        Seleccionar formato
      </p>
      <div className="grid grid-cols-3 gap-3">
        {availableOptions.map((option) => {
          const Icon = FORMAT_ICONS[option.value] || FileText
          return (
            <button
              key={option.value}
              onClick={() => onSelect(option.value)}
              disabled={disabled}
              className={cn(
                'group relative flex flex-col items-center gap-2 rounded-xl border p-5 transition-all duration-200',
                'hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.97]',
                'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
                'hover:border-purple-300/50 dark:hover:border-purple-500/30',
                disabled && 'opacity-50 cursor-not-allowed hover:translate-y-0 hover:shadow-none',
              )}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 group-hover:from-purple-500/20 group-hover:to-indigo-500/20 transition-all">
                <Icon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-gray-900 dark:text-white">{option.label}</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 leading-tight">
                  {option.description}
                </p>
              </div>
              <Download className="h-4 w-4 text-gray-300 dark:text-gray-600 group-hover:text-purple-400 transition-colors" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
