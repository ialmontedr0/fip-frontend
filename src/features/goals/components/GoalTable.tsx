import { useNavigate } from 'react-router-dom'
import { Eye, Edit3, Trash2, RefreshCw, TrendingUp } from 'lucide-react'
import { useDeleteGoal, useRefreshGoal } from '../hooks/useGoals'
import GoalTypeBadge from './GoalTypeBadge'
import GoalStatusBadge from './GoalStatusBadge'
import PrioritySelector from './PrioritySelector'
import ProgressBar from './ProgressBar'
import { formatCurrency } from '../constants'
import type { GoalListItem } from '@/types/goals'
import useConfirm from '@/hooks/useConfirm'

interface GoalTableProps {
  goals: GoalListItem[]
}

export default function GoalTable({ goals }: GoalTableProps) {
  const navigate = useNavigate()
  const deleteMutation = useDeleteGoal()
  const refreshMutation = useRefreshGoal()
  const { confirm, confirmDialog } = useConfirm()

  const handleDelete = async (goal: GoalListItem) => {
    if (!(await confirm({
      title: 'Eliminar meta',
      message: `Eliminar "${goal.name}"?`,
      confirmLabel: 'Eliminar',
      destructive: true,
    }))) return
    await deleteMutation.mutateAsync(goal.id)
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
            <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">Meta</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">Progreso</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">Estado</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">Prioridad</th>
            <th className="text-right px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">Objetivo</th>
            <th className="text-right px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">Actual</th>
            <th className="text-center px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
          {goals.map((goal) => (
            <tr
              key={goal.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer"
              onClick={() => navigate(`/goals/${goal.id}`)}
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <GoalTypeBadge type={goal.goal_type} showIcon={false} />
                  <span className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-[160px]">
                    {goal.name}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 min-w-[180px]">
                <ProgressBar
                  current={goal.current_amount}
                  target={goal.target_amount}
                  pct={goal.pct_complete}
                  size="sm"
                />
              </td>
              <td className="px-4 py-3">
                <GoalStatusBadge status={goal.status} />
              </td>
              <td className="px-4 py-3">
                <PrioritySelector value={goal.priority} readonly size="sm" />
              </td>
              <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-gray-100">
                {formatCurrency(goal.target_amount)}
              </td>
              <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-gray-100">
                {formatCurrency(goal.current_amount)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <button type="button" onClick={() => navigate(`/goals/${goal.id}`)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" title="Ver detalle">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => navigate(`/goals/${goal.id}/edit`)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" title="Editar">
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={async () => { await refreshMutation.mutateAsync(goal.id) }} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" title="Recalcular">
                    <RefreshCw className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => navigate(`/goals/${goal.id}/simulate`)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" title="Simular">
                    <TrendingUp className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => handleDelete(goal)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors" title="Eliminar">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {confirmDialog}
    </div>
  )
}
