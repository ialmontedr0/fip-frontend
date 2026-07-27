import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ArrowRight, AlertCircle } from 'lucide-react'
import { EXPECTED_FIELDS } from '@/types/imports'
import type { ColumnMapping } from '@/types/imports'

interface ColumnMappingStepProps {
  sourceColumns: string[]
  initialMappings?: ColumnMapping[]
  onConfirm: (mappings: ColumnMapping[]) => void
}

export default function ColumnMappingStep({
  sourceColumns, initialMappings, onConfirm,
}: ColumnMappingStepProps) {
  const [mappings, setMappings] = useState<ColumnMapping[]>(
    initialMappings ?? sourceColumns.map((col) => ({ sourceColumn: col, targetField: '' })),
  )

  const autoDetected = mappings.filter((m) => m.targetField).length
  const missing = EXPECTED_FIELDS.filter(
    (f) => f.required && !mappings.some((m) => m.targetField === f.value),
  )

  const updateMapping = (sourceColumn: string, targetField: string) => {
    setMappings((prev) => prev.map((m) =>
      m.sourceColumn === sourceColumn ? { ...m, targetField } : m,
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-gradient-to-r from-purple-500/30 to-transparent" />
        <p className="text-xs font-medium text-gray-400 dark:text-gray-500">
          {autoDetected} de {mappings.length} columnas mapeadas autom\u00e1ticamente
        </p>
        <div className="flex-1 h-px bg-gradient-to-l from-purple-500/30 to-transparent" />
      </div>

      {missing.length > 0 && (
        <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 p-3.5">
          <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
              Campos requeridos sin mapear
            </p>
            <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">
              {missing.map((f) => f.label).join(', ')} — Asigna estos campos para continuar
            </p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {mappings.map((mapping) => {
          const matchedField = EXPECTED_FIELDS.find((f) => f.value === mapping.targetField)
          return (
            <div
              key={mapping.sourceColumn}
              className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 p-3 transition-all hover:shadow-sm"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">
                  {mapping.sourceColumn}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-300 dark:text-gray-600 shrink-0" />
              <div className="flex-1">
                <select
                  value={mapping.targetField}
                  onChange={(e) => updateMapping(mapping.sourceColumn, e.target.value)}
                  className={cn(
                    'w-full rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all',
                    'focus:outline-none focus:ring-2 focus:ring-purple-500/30',
                    mapping.targetField
                      ? 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                      : 'border-red-200 dark:border-red-500/30 bg-red-50/50 dark:bg-red-500/5 text-gray-400',
                  )}
                >
                  <option value="">— Seleccionar campo —</option>
                  {EXPECTED_FIELDS.map((field) => (
                    <option key={field.value} value={field.value}>
                      {field.label}{field.required ? ' *' : ''}
                    </option>
                  ))}
                  <option value="__ignore__">Ignorar columna</option>
                </select>
              </div>
              {matchedField && (
                <span className={cn(
                  'text-[10px] font-semibold px-2 py-0.5 rounded-md',
                  matchedField.required
                    ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
                )}>
                  {matchedField.required ? 'Requerido' : 'Opcional'}
                </span>
              )}
            </div>
          )
        })}
      </div>

      <button
        onClick={() => onConfirm(mappings)}
        disabled={missing.length > 0}
        className="w-full rounded-xl py-3 text-sm font-bold bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.97] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        Confirmar mapeo
      </button>
    </div>
  )
}
