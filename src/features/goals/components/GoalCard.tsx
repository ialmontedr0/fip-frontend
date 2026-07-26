import { useNavigate } from 'react-router-dom'
import {
  MoreHorizontal, Edit3, Trash2, RefreshCw, Eye, TrendingUp, Zap,
  ChevronRight,
} from 'lucide-react'
import { useState, useCallback } from 'react'
import ProgressRing from './ProgressRing'
import GoalTypeBadge from './GoalTypeBadge'
import GoalStatusBadge from './GoalStatusBadge'
import PrioritySelector from './PrioritySelector'
import ProgressBar from './ProgressBar'
import { useDeleteGoal, useRefreshGoal } from '../hooks/useGoals'
import { formatCurrency, GOAL_TYPE_CONFIG } from '../constants'
import type { GoalListItem, GoalType } from '@/types/goals'
import { cn } from '@/lib/utils'

interface GoalCardProps {
  goal: GoalListItem
  index?: number
}

export default function GoalCard({ goal, index = 0 }: GoalCardProps) {
  const navigate = useNavigate()
  const deleteMutation = useDeleteGoal()
  const refreshMutation = useRefreshGoal()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const typeConfig = GOAL_TYPE_CONFIG[goal.goal_type as GoalType]
  const TypeIcon = typeConfig?.icon
  const behind = goal.pct_complete < 50 && goal.status === 'active'
  const pct = goal.pct_complete

  const handleDelete = useCallback(async () => {
    if (!window.confirm(`Eliminar "${goal.name}"?`)) return
    await deleteMutation.mutateAsync(goal.id)
  }, [goal.id, goal.name, deleteMutation])

  return (
    <div
      className={cn(
        'group relative bg-white dark:bg-gray-800/80 rounded-2xl border shadow-sm overflow-hidden cursor-pointer',
        'hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/30 transition-all duration-500',
        'opacity-0 animate-fade-in',
        isHovered ? 'border-violet-300 dark:border-violet-500/50 scale-[1.02]' : 'border-gray-100 dark:border-gray-700/50',
      )}
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'both' }}
      onClick={() => navigate(`/goals/${goal.id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/goals/${goal.id}`) }}
    >
      {/* Gradient top accent */}
      <div
        className={cn(
          'absolute top-0 left-0 right-0 h-1 bg-gradient-to-r transition-opacity duration-500',
          typeConfig?.gradient || 'from-gray-400 to-gray-600',
          isHovered ? 'opacity-100' : 'opacity-60',
        )}
      />

      {/* Background radial glow */}
      <div
        className={cn(
          'absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-20 dark:group-hover:opacity-30 transition-all duration-700 pointer-events-none',
        )}
        style={{
          background: `radial-gradient(circle, ${typeConfig?.color?.replace('text-', '').split('-')[0] === 'text' ? '#8b5cf6' : '#8b5cf6'} 0%, transparent 70%)`,
        }}
      />

      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 min-w-0">
            {TypeIcon && (
              <div
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300',
                  typeConfig?.bgColor || 'bg-gray-100 dark:bg-gray-700',
                  isHovered && 'shadow-lg shadow-violet-500/20',
                )}
              >
                <TypeIcon className={cn('h-5 w-5', typeConfig?.color || 'text-gray-500')} />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate leading-tight">
                {goal.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {formatCurrency(goal.current_amount)} de {formatCurrency(goal.target_amount)}
              </p>
            </div>
          </div>

          <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Opciones"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-1 z-20 w-44 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl py-1 animate-fade-in">
                  <button type="button" onClick={() => { setMenuOpen(false); navigate(`/goals/${goal.id}`) }} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <Eye className="h-4 w-4" /> Ver detalle
                  </button>
                  <button type="button" onClick={() => { setMenuOpen(false); navigate(`/goals/${goal.id}/edit`) }} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <Edit3 className="h-4 w-4" /> Editar
                  </button>
                  <button type="button" onClick={() => { setMenuOpen(false); refreshMutation.mutateAsync(goal.id) }} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <RefreshCw className={cn('h-4 w-4', refreshMutation.isPending && 'animate-spin')} /> Recalcular
                  </button>
                  <button type="button" onClick={() => { setMenuOpen(false); navigate(`/goals/${goal.id}/simulate`) }} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <TrendingUp className="h-4 w-4" /> Simular
                  </button>
                  <hr className="my-1 border-gray-100 dark:border-gray-700" />
                  <button type="button" onClick={() => { setMenuOpen(false); handleDelete() }} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                    <Trash2 className="h-4 w-4" /> Eliminar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Progress section */}
        <div className="flex items-center gap-4 mb-4">
          <div className={cn('transition-transform duration-500', isHovered && 'scale-110')}>
            <ProgressRing progress={pct} size={56} strokeWidth={5} behindSchedule={behind}>
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                {pct.toFixed(0)}%
              </span>
            </ProgressRing>
          </div>
          <div className="flex-1 min-w-0">
            <ProgressBar current={goal.current_amount} target={goal.target_amount} pct={pct} size="sm" behindSchedule={behind} />
          </div>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <GoalTypeBadge type={goal.goal_type} />
          <GoalStatusBadge status={goal.status} />
          {goal.status === 'active' && <PrioritySelector value={goal.priority} readonly size="sm" />}
          {goal.predicted_probability != null && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Zap className="h-2.5 w-2.5" />
              {(goal.predicted_probability * 100).toFixed(0)}% prob.
            </span>
          )}
          {goal.auto_contribute && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              Auto
            </span>
          )}
        </div>

        {/* Predicted completion */}
        {goal.predicted_completion_date && (
          <p className="mt-3 text-[11px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Completada estimada: {new Date(goal.predicted_completion_date).toLocaleDateString('es-MX', { year: 'numeric', month: 'short' })}
          </p>
        )}

        {/* Hover actions overlay */}
        <div
          className={cn(
            'absolute inset-x-0 bottom-0 flex items-center justify-between px-5 py-2.5 bg-gradient-to-t from-gray-50 dark:from-gray-800/90 to-transparent backdrop-blur-sm transition-all duration-300',
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none',
          )}
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); navigate(`/goals/${goal.id}/simulate`) }}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-violet-600 dark:text-violet-400 bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:bg-violet-50 dark:hover:bg-gray-600 transition-all"
          >
            <TrendingUp className="h-3 w-3" />
            Simular
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); navigate(`/goals/${goal.id}`) }}
            className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
          >
            Ver detalle
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  )
}
