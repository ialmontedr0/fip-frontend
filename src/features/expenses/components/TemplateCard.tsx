import { cn, formatCurrency } from '@/lib/utils'
import { FileText, Plus, Trash2 } from 'lucide-react'
import type { TemplateResponse } from '@/types/expenses'

interface Props {
  template: TemplateResponse
  onDelete: (id: string) => void
  onUse: (id: string) => void
  className?: string
}

export default function TemplateCard({ template, onDelete, onUse, className }: Props) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl',
        'border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-xl',
        'transition-all duration-300 p-4 group',
        className,
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-500/10">
            <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{template.name}</p>
            <p className="text-[11px] text-gray-400 line-clamp-1">{template.description}</p>
          </div>
        </div>
      </div>

      {template.default_amount && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          Monto por defecto: <span className="font-semibold text-gray-700 dark:text-gray-300">{formatCurrency(template.default_amount, template.default_currency)}</span>
        </p>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700/30">
        <div className="flex items-center gap-2 text-[11px] text-gray-400">
          <span>Usada {template.usage_count} veces</span>
          {template.last_used_at && (
            <>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <span>Ultima: {new Date(template.last_used_at).toLocaleDateString('es-DO')}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onUse(template.id)}
            className="rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors"
            title="Crear gasto desde plantilla"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(template.id)}
            className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            title="Eliminar plantilla"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
