import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Skeleton } from '@/components/ui'
import { useIncomeSummary, useIncomeTrends, useIncomeForecast, useIncomeBySource, useIncomeByCategory } from '../hooks/useIncomes'
import SummaryCards from '../components/SummaryCards'
import TrendsChart from '../components/TrendsChart'
import ForecastCard from '../components/ForecastCard'
import BySourceChart from '../components/BySourceChart'
import ByCategoryChart from '../components/ByCategoryChart'
import { PERIOD_OPTIONS } from '../constants'
import IncomeNav from '../components/IncomeNav'
import { ArrowLeft, BarChart3 } from 'lucide-react'

function getDateRange(period: string): { date_from: string; date_to: string } {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth()

  switch (period) {
    case 'this_month':
      return { date_from: `${y}-${String(m + 1).padStart(2, '0')}-01`, date_to: now.toISOString().split('T')[0] }
    case 'last_month': {
      const firstDay = new Date(y, m - 1, 1)
      const lastDay = new Date(y, m, 0)
      return { date_from: firstDay.toISOString().split('T')[0], date_to: lastDay.toISOString().split('T')[0] }
    }
    case 'this_quarter': {
      const q = Math.floor(m / 3) * 3
      return { date_from: `${y}-${String(q + 1).padStart(2, '0')}-01`, date_to: now.toISOString().split('T')[0] }
    }
    case 'this_year':
      return { date_from: `${y}-01-01`, date_to: now.toISOString().split('T')[0] }
    case 'last_year':
      return { date_from: `${y - 1}-01-01`, date_to: `${y - 1}-12-31` }
    default:
      return { date_from: `${y}-01-01`, date_to: now.toISOString().split('T')[0] }
  }
}

export default function IncomeSummaryPage() {
  const navigate = useNavigate()
  const [period, setPeriod] = useState('this_year')

  const { date_from, date_to } = useMemo(() => getDateRange(period), [period])

  const { data: summary, isLoading: summaryLoading } = useIncomeSummary(date_from, date_to)
  const { data: trends, isLoading: trendsLoading } = useIncomeTrends(12)
  const { data: forecast, isLoading: forecastLoading } = useIncomeForecast()
  const { data: bySource, isLoading: bySourceLoading } = useIncomeBySource(date_from, date_to)
  const { data: byCategory, isLoading: byCategoryLoading } = useIncomeByCategory(date_from, date_to)

  return (
    <div className="space-y-6">
      <IncomeNav />

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-6 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="relative flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate('/incomes')}
              className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <BarChart3 className="h-6 w-6" />
            <div>
              <h1 className="text-2xl font-bold">Dashboard de Ingresos</h1>
              <p className="text-emerald-100 text-sm mt-1">Analisis completo de tus ingresos</p>
            </div>
          </div>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="rounded-xl bg-white/20 text-white border-0 px-3 py-2 text-sm backdrop-blur-sm"
          >
            {PERIOD_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="text-gray-900">{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {summaryLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      ) : summary ? (
        <SummaryCards
          totalIncome={summary.total_income}
          averageMonthly={summary.average_monthly_income}
          netIncome={summary.net_income}
          totalCount={summary.total_count}
          grossIncome={summary.gross_income}
          totalTaxWithheld={summary.total_tax_withheld}
        />
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {trendsLoading ? <Skeleton className="h-80 rounded-2xl" /> : <TrendsChart data={trends} />}
        </div>
        <div>
          {forecastLoading ? <Skeleton className="h-80 rounded-2xl" /> : <ForecastCard data={forecast} />}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {bySourceLoading ? <Skeleton className="h-80 rounded-2xl" /> : <BySourceChart data={bySource} />}
        {byCategoryLoading ? <Skeleton className="h-80 rounded-2xl" /> : <ByCategoryChart data={byCategory} />}
      </div>
    </div>
  )
}
