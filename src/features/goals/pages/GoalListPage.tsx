import { useState, useCallback, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Plus, Target, List, LayoutGrid, Search, SlidersHorizontal,
  ArrowUpDown, CircleDot, CheckCircle2, AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useGoals, useGoalSummary } from '../hooks/useGoals'
import GoalCard from '../components/GoalCard'
import GoalTable from '../components/GoalTable'
import GoalFilters from '../components/GoalFilters'
import EmptyGoalState from '../components/EmptyGoalState'

import type { GoalFilters as GoalFiltersType, GoalListItem } from '@/types/goals'

type ViewMode = 'grid' | 'list'
type SortKey = 'name' | 'progress' | 'target' | 'deadline'

export default function GoalListPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortKey>('deadline')
  const [showFilters, setShowFilters] = useState(false)

  const filters: GoalFiltersType = {
    goal_type: searchParams.get('goal_type') as GoalFiltersType['goal_type'] || undefined,
    status: searchParams.get('status') as GoalFiltersType['status'] || undefined,
    priority: searchParams.get('priority') ? Number(searchParams.get('priority')) as GoalFiltersType['priority'] : undefined,
  }

  const { data, isLoading } = useGoals(filters)
  const { data: summary } = useGoalSummary()

  const handleFilterChange = useCallback((newFilters: GoalFiltersType) => {
    const params = new URLSearchParams()
    if (newFilters.goal_type) params.set('goal_type', newFilters.goal_type)
    if (newFilters.status) params.set('status', newFilters.status)
    if (newFilters.priority != null) params.set('priority', String(newFilters.priority))
    setSearchParams(params, { replace: true })
  }, [setSearchParams])

  const goals = (data?.goals || []) as GoalListItem[]

  const filteredAndSorted = useMemo(() => {
    let result = goals
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter((g) => g.name.toLowerCase().includes(q))
    }
    return [...result].sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name)
        case 'progress': return b.pct_complete - a.pct_complete
        case 'target': return Number(b.target_amount) - Number(a.target_amount)
        case 'deadline':
          return new Date(a.target_date).getTime() - new Date(b.target_date).getTime()
        default: return 0
      }
    })
  }, [goals, searchQuery, sortBy])

  return (
    <div className="relative space-y-6 pb-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-violet-500/5 blur-3xl dark:bg-violet-500/10" />
        <div className="absolute -right-40 top-60 h-80 w-80 rounded-full bg-purple-500/5 blur-3xl dark:bg-purple-500/10" />
      </div>

      {/* Stats bar */}
      {summary && !isLoading && (
        <div className="relative animate-fade-in grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white dark:bg-gray-800/80 rounded-xl border border-gray-100 dark:border-gray-700/50 px-4 py-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-500/10">
              <Target className="h-4 w-4 text-violet-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">{summary.total_goals}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Total metas</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800/80 rounded-xl border border-gray-100 dark:border-gray-700/50 px-4 py-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
              <CircleDot className="h-4 w-4 text-emerald-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">{summary.active_goals}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Activas</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800/80 rounded-xl border border-gray-100 dark:border-gray-700/50 px-4 py-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10">
              <CheckCircle2 className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">{summary.completed_goals}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Completadas</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800/80 rounded-xl border border-gray-100 dark:border-gray-700/50 px-4 py-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-500/10">
              <AlertTriangle className={cn('h-4 w-4', summary.behind_schedule_count > 0 ? 'text-amber-500' : 'text-gray-400')} />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">{summary.behind_schedule_count}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Atrasadas</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Metas</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {data?.total != null ? `${data.total} meta${data.total !== 1 ? 's' : ''}` : 'Gestiona tus metas financieras'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={cn('p-2 rounded-lg transition-colors', viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm text-violet-600' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300')}
                title="Vista tarjetas"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={cn('p-2 rounded-lg transition-colors', viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm text-violet-600' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300')}
                title="Vista tabla"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => navigate('/goals/new')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              Nueva Meta
            </button>
          </div>
        </div>
      </div>

      {/* Search & Sort bar */}
      <div className="relative animate-fade-in" style={{ animationDelay: '0.05s', animationFillMode: 'both' }}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar metas..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                className="appearance-none pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 cursor-pointer"
              >
                <option value="deadline">Fecha limite</option>
                <option value="progress">Progreso</option>
                <option value="name">Nombre</option>
                <option value="target">Monto</option>
              </select>
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'inline-flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all',
                showFilters
                  ? 'border-violet-200 dark:border-violet-500/30 bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50',
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Filters panel */}
      <div
        className={cn(
          'relative overflow-hidden transition-all duration-300',
          showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="p-4 bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
          <GoalFilters filters={filters} onChange={handleFilterChange} />
        </div>
      </div>

      {/* Content */}
      <div className="relative animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
        {isLoading ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-gray-200 dark:bg-gray-700" />
                    <div className="flex-1">
                      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                      <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded mt-1" />
                    </div>
                  </div>
                  <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                  <div className="flex gap-2 mt-3">
                    <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div className="h-5 w-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-8">
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-12 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                ))}
              </div>
            </div>
          )
        ) : filteredAndSorted.length > 0 ? (
          <>
            {searchQuery && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                {filteredAndSorted.length} resultado{filteredAndSorted.length !== 1 ? 's' : ''} para &quot;{searchQuery}&quot;
              </p>
            )}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAndSorted.map((goal, idx) => (
                  <GoalCard key={goal.id} goal={goal} index={idx} />
                ))}
              </div>
            ) : (
              <GoalTable goals={filteredAndSorted} />
            )}
          </>
        ) : (
          <EmptyGoalState
            message={searchQuery ? `Sin resultados para "${searchQuery}"` : 'No tienes metas aun'}
            subtitle={searchQuery ? 'Intenta con otros terminos de busqueda' : 'Crea tu primera meta financiera'}
            onCreateClick={() => navigate('/goals/new')}
          />
        )}
      </div>
    </div>
  )
}
