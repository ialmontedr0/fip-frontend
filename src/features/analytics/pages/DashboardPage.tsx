import { useDashboard } from '../hooks/useAnalytics'
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

function DashboardPage() {
  const { data, isLoading, isError } = useDashboard()

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
    </div>
  )
}

export default DashboardPage
