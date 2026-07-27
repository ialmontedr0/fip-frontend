import { useState, useCallback, useRef, useEffect } from 'react'
import DateRangePicker from '@/components/charts/DateRangePicker'
import CashFlowChart from '../components/CashFlowChart'
import TopCategoriesWidget from '../components/TopCategoriesWidget'
import SpendingTrendChart from '../components/SpendingTrendChart'
import SpendingHeatmap from '../components/SpendingHeatmap'
import CashFlowByAccountChart from '../components/CashFlowByAccountChart'
import NetWorthChart from '../components/NetWorthChart'
import ExportButton from '../components/ExportButton'
import { ErrorBoundary } from '@/components/layout/ErrorBoundary'
import {
  useCashFlow,
  useTopCategories,
  useSpendingTrend,
  useCashFlowByAccount,
  useSpendingHeatmap,
  useNetWorth,
} from '../hooks/useAnalytics'
import { cn } from '@/lib/utils'
import { BarChart3, TrendingUp, LayoutGrid } from 'lucide-react'

function getDefaultRange() {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  return {
    start: start.toISOString().slice(0, 10),
    end: now.toISOString().slice(0, 10),
  }
}

const SECTIONS = [
  { id: 'cashflow', label: 'Flujo & Patrimonio', icon: TrendingUp },
  { id: 'spending', label: 'Gastos & Categorias', icon: BarChart3 },
  { id: 'advanced', label: 'Visualizaciones', icon: LayoutGrid },
] as const

function AnalyticsPage() {
  const [startDate, setStartDate] = useState(getDefaultRange().start)
  const [endDate, setEndDate] = useState(getDefaultRange().end)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const params = { start_date: startDate, end_date: endDate }

  const { data: cashFlow, isLoading: cfLoading, isError: cfError } = useCashFlow(params)
  const {
    data: topCategories,
    isLoading: tcLoading,
    isError: tcError,
  } = useTopCategories({ ...params, transaction_type: 'expense', limit: 8 })
  const {
    data: spendingTrend,
    isLoading: stLoading,
    isError: stError,
  } = useSpendingTrend({ ...params, period: 'monthly' })
  const {
    data: cashFlowByAccount,
    isLoading: cfaLoading,
    isError: cfaError,
  } = useCashFlowByAccount(params)
  const { data: heatmap, isLoading: hmLoading, isError: hmError } = useSpendingHeatmap(params)
  const { data: netWorth, isLoading: nwLoading, isError: nwError } = useNetWorth()

  const getExportElement = useCallback(() => gridRef.current, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0px -70% 0px' },
    )
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref)
    })
    return () => observer.disconnect()
  }, [])

  const scrollTo = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="relative space-y-8 pb-8">
      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary-500/5 blur-3xl dark:bg-primary-500/10" />
        <div className="absolute -right-40 top-1/3 h-80 w-80 rounded-full bg-violet-500/5 blur-3xl dark:bg-violet-500/10" />
        <div className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-emerald-500/5 blur-3xl dark:bg-emerald-500/10" />
      </div>

      {/* Sticky header */}
      <div className="sticky top-0 z-30 -mx-6 -mt-6 border-b border-gray-100 bg-white/80 px-6 pb-0 pt-6 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/80">
        <div className="flex flex-col gap-4 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 shadow-lg shadow-primary-500/20">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Analitica
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Analisis financiero detallado con filtros de fecha
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onChange={(start, end) => {
                setStartDate(start)
                setEndDate(end)
              }}
            />
            <ExportButton
              getElement={getExportElement}
              filename={`analytics-${startDate}-${endDate}`}
            />
          </div>
        </div>

        {/* Section nav */}
        <nav className="flex gap-1 pb-0 overflow-x-auto scrollbar-none">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => scrollTo(section.id)}
              className={cn(
                'flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-xs font-medium transition-all duration-200 whitespace-nowrap',
                activeSection === section.id
                  ? 'border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                  : 'border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-600 dark:hover:border-gray-600 dark:hover:text-gray-300',
              )}
            >
              <section.icon className="h-3.5 w-3.5" />
              {section.label}
            </button>
          ))}
        </nav>
      </div>

      <div ref={gridRef} className="space-y-10">
        {/* Section 1: Cash Flow & Net Worth */}
        <section
          id="cashflow"
          ref={(el: HTMLDivElement | null) => {
            sectionRefs.current.cashflow = el
          }}
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-green-400 to-blue-500 shadow-sm">
              <TrendingUp className="h-3.5 w-3.5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                Flujo de Caja & Patrimonio
              </h2>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Ingresos, gastos y composicion patrimonial
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="transition-all duration-500 hover:translate-y-[-2px]">
              <ErrorBoundary>
                <CashFlowChart cashFlow={cashFlow} loading={cfLoading} error={cfError} />
              </ErrorBoundary>
            </div>
            <div className="transition-all duration-500 hover:translate-y-[-2px]">
              <ErrorBoundary>
                <NetWorthChart netWorth={netWorth} loading={nwLoading} error={nwError} />
              </ErrorBoundary>
            </div>
          </div>
        </section>

        {/* Section 2: Spending & Categories */}
        <section
          id="spending"
          ref={(el: HTMLDivElement | null) => {
            sectionRefs.current.spending = el
          }}
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-rose-400 to-orange-500 shadow-sm">
              <BarChart3 className="h-3.5 w-3.5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                Gastos & Categorias
              </h2>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Tendencia de gastos y distribucion por categoria
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="transition-all duration-500 hover:translate-y-[-2px]">
              <ErrorBoundary>
                <SpendingTrendChart
                  spendingTrend={spendingTrend}
                  loading={stLoading}
                  error={stError}
                />
              </ErrorBoundary>
            </div>
            <div className="transition-all duration-500 hover:translate-y-[-2px]">
              <ErrorBoundary>
                <TopCategoriesWidget
                  topCategories={topCategories}
                  loading={tcLoading}
                  error={tcError}
                />
              </ErrorBoundary>
            </div>
          </div>
        </section>

        {/* Section 3: Advanced Visualizations */}
        <section
          id="advanced"
          ref={(el: HTMLDivElement | null) => {
            sectionRefs.current.advanced = el
          }}
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-pink-500 shadow-sm">
              <LayoutGrid className="h-3.5 w-3.5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                Visualizaciones Avanzadas
              </h2>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Mapa de calor de gastos y flujo detallado por cuenta
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="transition-all duration-500 hover:translate-y-[-2px]">
              <ErrorBoundary>
                <SpendingHeatmap heatmap={heatmap} loading={hmLoading} error={hmError} />
              </ErrorBoundary>
            </div>
            <div className="transition-all duration-500 hover:translate-y-[-2px]">
              <ErrorBoundary>
                <CashFlowByAccountChart
                  data={cashFlowByAccount}
                  loading={cfaLoading}
                  error={cfaError}
                />
              </ErrorBoundary>
            </div>
          </div>
        </section>
      </div>

      {/* Scroll to top button */}
      {activeSection && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 text-white shadow-lg shadow-primary-500/30 transition-all duration-200 hover:shadow-xl hover:scale-105 animate-fade-in"
        >
          <TrendingUp className="h-4 w-4 rotate-90" />
        </button>
      )}
    </div>
  )
}

export default AnalyticsPage
