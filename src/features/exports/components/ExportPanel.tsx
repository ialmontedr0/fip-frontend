import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import { useExportDownload } from '../hooks/useExports'
import ExportFormatSelector from './ExportFormatSelector'
import ExportFilterPanel from './ExportFilterPanel'
import ExportProgressBar from './ExportProgressBar'
import ExportCalendarSection from './ExportCalendarSection'
import ExportTypeCard from './ExportTypeCard'
import { EXPORT_TYPES } from '../constants'
import type { ExportFormat, ExportTransactionsFilters } from '@/types/exports'

export default function ExportPanel() {
  const [selectedType, setSelectedType] = useState(EXPORT_TYPES[0])
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<ExportTransactionsFilters>({})
  const { progress, exportData, exportFromUrl } = useExportDownload()

  const handleExport = async (format: ExportFormat) => {
    const endpointMap: Record<string, string> = {
      transactions: 'transactions',
      budgets: 'budgets',
      goals: 'goals',
    }
    const entity = endpointMap[selectedType.id]
    if (!entity) return
    await exportData(entity, format, selectedType.id === 'transactions' ? filters : undefined)
  }

  const handleCalendarExport = async (endpoint: string) => {
    await exportFromUrl(endpoint, `${endpoint.replace(/\//g, '_')}.ics`)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {EXPORT_TYPES.map((type) => (
          <ExportTypeCard
            key={type.id}
            type={type}
            selected={selectedType.id === type.id}
            onClick={() => { setSelectedType(type); setShowFilters(false) }}
          />
        ))}
      </div>

      {selectedType && (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 p-6 shadow-sm animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">{selectedType.label}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{selectedType.description}</p>
            </div>
            {selectedType.id === 'transactions' && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all',
                  showFilters
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-750',
                )}
              >
                Filtros
                <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', showFilters && 'rotate-180')} />
              </button>
            )}
          </div>

          {showFilters && selectedType.id === 'transactions' && (
            <ExportFilterPanel filters={filters} onChange={setFilters} />
          )}

          {selectedType.formats.length > 0 && (
            <ExportFormatSelector
              formats={selectedType.formats}
              onSelect={handleExport}
              disabled={progress.inProgress}
            />
          )}

          {selectedType.hasCalendar && (
            <ExportCalendarSection
              endpoint={selectedType.endpoint}
              label={selectedType.description}
              onExport={handleCalendarExport}
              disabled={progress.inProgress}
            />
          )}
        </div>
      )}

      <ExportProgressBar progress={progress} />
    </div>
  )
}
