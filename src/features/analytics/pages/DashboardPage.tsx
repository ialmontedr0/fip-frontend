import { useState } from 'react'
import { useDashboard } from '../hooks/useAnalytics'
import { useLatestRecommendations } from '@/features/ai/hooks/useAI'
import RecommendationDetailModal from '@/features/ai/components/RecommendationDetailModal'
import KPIWidgets from '../components/KPIWidgets'
import CashFlowChart from '../components/CashFlowChart'
import NetWorthWidget from '../components/NetWorthWidget'
import TopCategoriesWidget from '../components/TopCategoriesWidget'
import SpendingTrendChart from '../components/SpendingTrendChart'
import FinancialHealthWidget from '../components/FinancialHealthWidget'
import BudgetStatusWidget from '../components/BudgetStatusWidget'
import UpcomingPaymentsWidget from '../components/UpcomingPaymentsWidget'
import GoalsProgressWidget from '../components/GoalsProgressWidget'
import { ErrorBoundary } from '@/components/layout/ErrorBoundary'
import { Link } from 'react-router-dom'
import { cn, formatCurrency } from '@/lib/utils'
import type { RecommendationItem } from '@/types/ai'
import { Lightbulb, Sparkles, PiggyBank, ArrowRight } from 'lucide-react'

function DashboardPage() {
  const { data, isLoading, isError } = useDashboard()
  const { data: latestRecs } = useLatestRecommendations()
  const [selectedRec, setSelectedRec] = useState<RecommendationItem | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const recs = latestRecs?.has_batch ? latestRecs.recommendations.slice(0, 3) : []

  const openRecModal = (rec: RecommendationItem) => {
    setSelectedRec(rec)
    setModalOpen(true)
  }

  const closeRecModal = () => {
    setModalOpen(false)
    setSelectedRec(null)
  }

  return (
    <div className="relative space-y-8 pb-8">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary-500/5 blur-3xl dark:bg-primary-500/10" />
        <div className="absolute -right-40 top-60 h-80 w-80 rounded-full bg-green-500/5 blur-3xl dark:bg-green-500/10" />
      </div>

      {/* Page header */}
      <div className="relative animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-primary-500 shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Dashboard
              </h1>
            </div>
            <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
              Resumen financiero del periodo actual
            </p>
          </div>
        </div>
      </div>

      {/* KPI Hero Section */}
      <div className="relative" style={{ animation: 'fadeIn 0.5s ease-out 0.1s both' }}>
        <ErrorBoundary>
          <KPIWidgets kpis={data?.kpis} loading={isLoading} error={isError} />
        </ErrorBoundary>
      </div>

      {/* Charts Grid */}
      <div>
        <div className="mb-4 flex items-center gap-3">
          <div className="h-1 w-6 rounded-full bg-gradient-to-r from-primary-500 to-primary-400" />
          <h2 className="text-xs font-semibold tracking-wider text-gray-400 dark:text-gray-500 uppercase">
            Analitica Visual
          </h2>
        </div>
        <div
          className="grid grid-cols-1 gap-6 lg:grid-cols-2"
          style={{ animation: 'fadeIn 0.5s ease-out 0.2s both' }}
        >
          <div
            className="animate-fade-in"
            style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
          >
            <ErrorBoundary>
              <CashFlowChart cashFlow={data?.cash_flow} loading={isLoading} error={isError} />
            </ErrorBoundary>
          </div>
          <div
            className="animate-fade-in"
            style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
          >
            <ErrorBoundary>
              <NetWorthWidget netWorth={data?.net_worth} loading={isLoading} error={isError} />
            </ErrorBoundary>
          </div>
          <div
            className="animate-fade-in"
            style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
          >
            <ErrorBoundary>
              <TopCategoriesWidget
                topCategories={data?.top_categories}
                loading={isLoading}
                error={isError}
              />
            </ErrorBoundary>
          </div>
          <div
            className="animate-fade-in"
            style={{ animationDelay: '0.5s', animationFillMode: 'both' }}
          >
            <ErrorBoundary>
              <SpendingTrendChart
                spendingTrend={data?.spending_trend}
                loading={isLoading}
                error={isError}
              />
            </ErrorBoundary>
          </div>
        </div>
      </div>

      {/* Financial Health */}
      <div>
        <div className="mb-4 flex items-center gap-3">
          <div className="h-1 w-6 rounded-full bg-gradient-to-r from-rose-500 to-pink-400" />
          <h2 className="text-xs font-semibold tracking-wider text-gray-400 dark:text-gray-500 uppercase">
            Salud Financiera
          </h2>
        </div>
        <div style={{ animation: 'fadeIn 0.5s ease-out 0.52s both' }}>
          <ErrorBoundary>
            <FinancialHealthWidget
              portfolio={data?.portfolio}
              loading={isLoading}
              error={isError}
            />
          </ErrorBoundary>
        </div>
      </div>

      {/* Presupuestos */}
      <div>
        <div className="mb-4 flex items-center gap-3">
          <div className="h-1 w-6 rounded-full bg-gradient-to-r from-violet-500 to-purple-400" />
          <h2 className="text-xs font-semibold tracking-wider text-gray-400 dark:text-gray-500 uppercase">
            Presupuestos
          </h2>
        </div>
        <div style={{ animation: 'fadeIn 0.5s ease-out 0.55s both' }}>
          <ErrorBoundary>
            <BudgetStatusWidget />
          </ErrorBoundary>
        </div>
      </div>

      {/* Bottom Widgets */}
      <div>
        <div className="mb-4 flex items-center gap-3">
          <div className="h-1 w-6 rounded-full bg-gradient-to-r from-amber-500 to-orange-400" />
          <h2 className="text-xs font-semibold tracking-wider text-gray-400 dark:text-gray-500 uppercase">
            Proximos Vencimientos & Metas
          </h2>
        </div>
        <div
          className="grid grid-cols-1 gap-6 lg:grid-cols-2"
          style={{ animation: 'fadeIn 0.5s ease-out 0.6s both' }}
        >
          <div
            className="animate-fade-in"
            style={{ animationDelay: '0.6s', animationFillMode: 'both' }}
          >
            <ErrorBoundary>
              <UpcomingPaymentsWidget
                payments={data?.upcoming_payments}
                loading={isLoading}
                error={isError}
              />
            </ErrorBoundary>
          </div>
          <div
            className="animate-fade-in"
            style={{ animationDelay: '0.7s', animationFillMode: 'both' }}
          >
            <ErrorBoundary>
              <GoalsProgressWidget goals={data?.goals} loading={isLoading} error={isError} />
            </ErrorBoundary>
          </div>
        </div>
      </div>

      {recs.length > 0 && (
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="h-1 w-6 rounded-full bg-gradient-to-r from-amber-500 to-orange-400" />
            <h2 className="text-xs font-semibold tracking-wider text-gray-400 dark:text-gray-500 uppercase">
              Recomendaciones IA
            </h2>
            <Link
              to="/ai"
              className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
            >
              Ver todas <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {recs.map((rec, i) => (
              <button
                key={`${i}-${rec.title}`}
                type="button"
                onClick={() => openRecModal(rec)}
                className={cn(
                  'w-full text-left rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-4 shadow-sm transition-all duration-300',
                  'hover:shadow-lg hover:-translate-y-0.5 hover:border-amber-200/50 dark:hover:border-amber-700/30 group cursor-pointer',
                  rec.priority === 'high' && 'border-l-4 border-l-amber-500',
                  rec.priority === 'medium' && 'border-l-4 border-l-blue-400',
                  rec.priority === 'low' && 'border-l-4 border-l-gray-300 dark:border-l-gray-600',
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 shadow-sm">
                    <Lightbulb className="h-4 w-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{rec.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">{rec.description}</p>
                    {rec.estimated_savings > 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        <PiggyBank className="h-3 w-3 text-emerald-500" />
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(rec.estimated_savings)}
                        </span>
                      </div>
                    )}
                  </div>
                  <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            ))}
          </div>
          <RecommendationDetailModal
            rec={selectedRec}
            isOpen={modalOpen}
            onClose={closeRecModal}
          />
        </div>
      )}
    </div>
  )
}

export default DashboardPage
