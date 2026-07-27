import { cn } from '@/lib/utils'
import { AlertTriangle, FileText } from 'lucide-react'
import type { ImportPreviewResponse } from '@/types/imports'

interface ConfirmStepProps {
  preview: ImportPreviewResponse
  onConfirm: () => void
  isLoading?: boolean
  errorRows: number
}

export default function ConfirmStep({ preview, onConfirm, isLoading, errorRows }: ConfirmStepProps) {
  const validRows = preview.total_rows - errorRows

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20">
            <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">{preview.file_name}</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {preview.file_type.toUpperCase()} — {preview.total_rows} filas
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 p-4 text-center">
            <p className="text-2xl font-black text-gray-900 dark:text-white">{preview.total_rows}</p>
            <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">Total filas</p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 p-4 text-center">
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{validRows}</p>
            <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">V\u00e1lidas</p>
          </div>
          <div className={cn(
            'rounded-xl p-4 text-center',
            errorRows > 0
              ? 'bg-gradient-to-br from-red-500/10 to-orange-500/10'
              : 'bg-gradient-to-br from-emerald-500/10 to-green-500/10',
          )}>
            <p className={cn(
              'text-2xl font-black',
              errorRows > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400',
            )}>
              {errorRows}
            </p>
            <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">Errores</p>
          </div>
        </div>

        {errorRows > 0 && (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 p-3">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 dark:text-amber-300">
              {errorRows} fila(s) con errores ser\u00e1n omitidas durante la importaci\u00f3n.
              Puedes corregir el archivo original y subirlo de nuevo.
            </p>
          </div>
        )}

        {preview.duplicates_found > 0 && (
          <div className="mt-2 flex items-start gap-2.5 rounded-xl bg-amber-50/50 dark:bg-amber-500/5 border border-amber-200/50 dark:border-amber-500/20 p-3">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              Se detectaron {preview.duplicates_found} posible(s) transacci\u00f3n(es) duplicada(s).
            </p>
          </div>
        )}
      </div>

      <button
        onClick={onConfirm}
        disabled={isLoading || validRows === 0}
        className="w-full rounded-xl py-3.5 text-sm font-bold bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.97] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Importando {validRows} transacciones...
          </span>
        ) : (
          `Importar ${validRows} transacci\u00f3n(es)`
        )}
      </button>
    </div>
  )
}
