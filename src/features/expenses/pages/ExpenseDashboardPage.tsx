import { useExpenseDashboard, useSpendingPatterns } from '../hooks/useExpenses'
import ExpenseNav from '../components/ExpenseNav'
import DailyTrendChart from '../components/DailyTrendChart'
import CategoryBreakdownChart from '../components/CategoryBreakdownChart'
import SpendingPatternChart from '../components/SpendingPatternChart'
import { Button, Skeleton } from '@/components/ui'
import { cn, formatCurrency } from '@/lib/utils'
import { TrendingDown, TrendingUp, AlertCircle, RefreshCw, Target, DollarSign } from 'lucide-react'
import { useState } from 'react'

function StatCard({ icon: Icon, label, value, subvalue, color, trend }: {
  icon: React.ElementType
  label: string
  value: string
  subvalue?: string
  color: string
  trend?: 'up' | 'down' | 'neutral'
}) {
  return (
    <div className="rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 p-5 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${color}15` }}>
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</p>
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        </div>
      </div>
      {subvalue && (
        <div className="flex items-center gap-1.5 text-xs">
          {trend === 'up' && <TrendingUp className="h-3.5 w-3.5 text-red-500" />}
          {trend === 'down' && <TrendingDown className="h-3.5 w-3.5 text-emerald-500" />}
          <span className="text-gray-400">{subvalue}</span>
        </div>
      )}
    </div>
  )
}

export default function ExpenseDashboardPage() {
  const [period, setPeriod] = useState<'30d' | '90d' | '12m'>('30d')
  const dateFrom = period === '30d' ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : period === '90d' ? new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const dateTo = new Date().toISOString().split('T')[0]
  const { data: dashboard, isLoading: dashLoading, isError: dashError, refetch: refetchDash } = useExpenseDashboard(dateFrom, dateTo)
  const { data: patterns, isLoading: patLoading } = useSpendingPatterns()

  if (dashLoading) {
    return (
      <div className="space-y-5 animate-fade-in">
        <ExpenseNav />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <ExpenseNav />

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 via-red-500 to-orange-600 p-6 text-white">
        <div className="relative flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Dashboard de Gastos</h1>
              <p className="text-rose-100/80 text-sm">Visualiza y analiza tus gastos</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {(['30d', '90d', '12m'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  period === p
                    ? 'bg-white text-rose-700 shadow-lg'
                    : 'bg-white/10 text-white/70 hover:bg-white/20',
                )}
              >
                {p === '30d' ? '30 dias' : p === '90d' ? '90 dias' : '12 meses'}
              </button>
            ))}
            <Button variant="ghost" onClick={() => refetchDash()} className="bg-white/10 hover:bg-white/20 text-white rounded-xl h-8">
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {dashError && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
          <p className="text-red-500 font-medium">Error al cargar dashboard</p>
          <Button variant="outline" onClick={() => refetchDash()} className="rounded-xl mt-2">Reintentar</Button>
        </div>
      )}

      {dashboard && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={DollarSign}
              label="Total Gastado"
              value={formatCurrency(dashboard.total_expenses)}
              subvalue={`${dashboard.total_count} transacciones`}
              color="#ef4444"
            />
            <StatCard
              icon={TrendingUp}
              label="Promedio Diario"
              value={formatCurrency(dashboard.daily_average)}
              color="#f59e0b"
            />
            <StatCard
              icon={TrendingDown}
              label="Suscripciones"
              value={formatCurrency(dashboard.monthly_subscriptions)}
              subvalue="mensual"
              color="#8b5cf6"
            />
            <StatCard
              icon={Target}
              label="Categorias"
              value={`${dashboard.by_category?.length || 0}`}
              subvalue={`en el periodo`}
              color="#10b981"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <DailyTrendChart data={dashboard.daily_trend} />
            <CategoryBreakdownChart data={dashboard.by_category} />
          </div>

          {patterns && !patLoading && (
            <SpendingPatternChart data={patterns.monthly_data.map((d) => ({ day_of_week: d.month, total: d.total, count: d.count }))} />
          )}
        </>
      )}
    </div>
  )
}
