import { cn } from '@/lib/utils'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import type { ImportValidationError } from '@/types/imports'

interface PreviewTableProps {
  columns: string[]
  rows: Record<string, unknown>[]
  errors: ImportValidationError[]
  duplicatesCount: number
}

export default function PreviewTable({ columns, rows, errors, duplicatesCount }: PreviewTableProps) {
  const errorRows = new Set(errors.map((e) => e.row))

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          {rows.length} filas
        </span>
        {errors.length > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400">
            <AlertTriangle className="h-3.5 w-3.5" />
            {errors.length} error(es) de validaci\u00f3n
          </span>
        )}
        {duplicatesCount > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-400">
            <AlertTriangle className="h-3.5 w-3.5" />
            {duplicatesCount} posible(s) duplicado(s)
          </span>
        )}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <th className="px-3 py-2.5 text-left font-semibold text-gray-500 dark:text-gray-400 w-12">#</th>
              {columns.map((col) => (
                <th key={col} className="px-3 py-2.5 text-left font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const rowNum = idx + 2
              const hasErrors = errorRows.has(rowNum) || errorRows.has(0)
              const rowErrors = errors.filter((e) => e.row === rowNum || e.row === 0)
              return (
                <tr
                  key={idx}
                  className={cn(
                    'border-b border-gray-50 dark:border-gray-800 last:border-0 transition-colors',
                    hasErrors ? 'bg-red-50/50 dark:bg-red-500/5' : 'hover:bg-gray-50/50 dark:hover:bg-gray-800/50',
                  )}
                >
                  <td className={cn(
                    'px-3 py-2.5 font-mono text-gray-400',
                    hasErrors && 'text-red-500 font-bold',
                  )}>
                    {rowNum - 1}
                  </td>
                  {columns.map((col) => {
                    const fieldErrors = rowErrors.filter((e) => e.field === col || e.field === 'columns')
                    const hasFieldError = fieldErrors.length > 0
                    return (
                      <td key={col} className="px-3 py-2.5 max-w-[200px]">
                        <div className="relative">
                          <span className={cn(
                            'block truncate',
                            hasFieldError ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-700 dark:text-gray-300',
                          )}>
                            {String(row[col] ?? '') || <span className="text-gray-300 dark:text-gray-600 italic">vac\u00edo</span>}
                          </span>
                          {hasFieldError && (
                            <div className="absolute top-full left-0 z-10 mt-1 w-48 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 p-2 text-[10px] text-red-700 dark:text-red-400 shadow-lg">
                              {fieldErrors.map((fe, i) => <p key={i}>{fe.message}</p>)}
                            </div>
                          )}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {rows.length === 0 && (
        <p className="text-center text-sm text-gray-400 py-8">No hay datos para previsualizar</p>
      )}
    </div>
  )
}
