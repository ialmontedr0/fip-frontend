import { useNavigate } from 'react-router-dom'
import { cn, formatCurrency } from '@/lib/utils'
import IncomeTypeBadge from './IncomeTypeBadge'
import IncomeStatusBadge from './IncomeStatusBadge'
import StabilityBadge from './StabilityBadge'
import { Edit3, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui'
import type { IncomeResponse } from '@/types/incomes'

interface Props {
  incomes: IncomeResponse[]
  className?: string
  selectedIds?: Set<string>
  onSelect?: (id: string) => void
  onSelectAll?: () => void
  onEdit?: (income: IncomeResponse) => void
  onDelete?: (income: IncomeResponse) => void
}

export default function IncomeTable({ incomes, className, selectedIds, onSelect, onSelectAll, onEdit, onDelete }: Props) {
  const navigate = useNavigate()
  const allSelected = selectedIds && incomes.length > 0 && selectedIds.size === incomes.length

  return (
    <div className={cn('overflow-x-auto rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50', className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200/50 dark:border-gray-700/50">
            {onSelect && (
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onSelectAll}
                  className="rounded border-gray-300"
                />
              </th>
            )}
            <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Descripcion</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Fecha</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Tipo</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Estabilidad</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Estado</th>
            <th className="px-4 py-3 text-right font-medium text-gray-500 dark:text-gray-400">Monto</th>
            <th className="px-4 py-3 text-right font-medium text-gray-500 dark:text-gray-400">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
          {incomes.map((income) => (
            <tr
              key={income.id}
              onClick={() => navigate(`/incomes/${income.id}`)}
              className={cn(
                'transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-700/30 cursor-pointer',
                selectedIds?.has(income.id) && 'bg-primary-50/50 dark:bg-primary-500/5',
              )}
            >
              {onSelect && (
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedIds?.has(income.id)}
                    onChange={() => onSelect(income.id)}
                    className="rounded border-gray-300"
                  />
                </td>
              )}
              <td className="px-4 py-3">
                <p className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-[200px]">{income.description}</p>
              </td>
              <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {income.effective_date ? new Date(income.effective_date).toLocaleDateString('es-DO') : '-'}
              </td>
              <td className="px-4 py-3">
                <IncomeTypeBadge type={income.income_type} size="sm" />
              </td>
              <td className="px-4 py-3">
                <StabilityBadge stability={income.stability} size="sm" />
              </td>
              <td className="px-4 py-3">
                <IncomeStatusBadge status={income.income_status} size="sm" />
              </td>
              <td className="px-4 py-3 text-right font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                {formatCurrency(income.amount, income.currency_code)}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/incomes/${income.id}`)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onEdit?.(income)}>
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete?.(income)} className="text-red-500 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
