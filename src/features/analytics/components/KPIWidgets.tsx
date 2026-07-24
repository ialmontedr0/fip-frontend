import { TrendingUp, TrendingDown, ArrowRightLeft, PiggyBank } from 'lucide-react'
import type { MonthlyKPIs } from '@/types/analytics'
import KPICard from '@/components/charts/KPICard'

interface Props {
  kpis: MonthlyKPIs | undefined
  loading: boolean
  error: boolean
}

const cards = [
  {
    key: 'income' as const,
    title: 'Ingresos',
    icon: <TrendingUp className="h-5 w-5" />,
    color: 'success' as const,
  },
  {
    key: 'expenses' as const,
    title: 'Gastos',
    icon: <TrendingDown className="h-5 w-5" />,
    color: 'danger' as const,
  },
  {
    key: 'netFlow' as const,
    title: 'Flujo Neto',
    icon: <ArrowRightLeft className="h-5 w-5" />,
    color: 'primary' as const,
  },
  {
    key: 'savings' as const,
    title: 'Ahorro',
    format: 'percentage' as const,
    icon: <PiggyBank className="h-5 w-5" />,
    color: 'info' as const,
  },
]

export default function KPIWidgets({ kpis, loading }: Props) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-white p-6 dark:from-gray-900 dark:to-gray-950 border border-gray-100 dark:border-gray-800">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.06),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(34,197,94,0.04),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_bottom_left,rgba(34,197,94,0.06),transparent_50%)]" />

      <div className="relative z-10">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-1 w-8 rounded-full bg-gradient-to-r from-primary-500 to-primary-400" />
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Resumen del Periodo
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, index) => {
            let value = 0
            let previousValue: number | undefined

            if (card.key === 'income') {
              value = kpis?.total_income ?? 0
              previousValue = kpis?.comparison.prev_income
            } else if (card.key === 'expenses') {
              value = kpis?.total_expenses ?? 0
              previousValue = kpis?.comparison.prev_expenses
            } else if (card.key === 'netFlow') {
              value = kpis?.net_flow ?? 0
            } else if (card.key === 'savings') {
              value = kpis?.savings_rate ?? 0
            }

            return (
              <div
                key={card.key}
                className="animate-fade-in"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: 'both',
                }}
              >
                <KPICard
                  title={card.title}
                  value={value}
                  previousValue={previousValue}
                  icon={card.icon}
                  color={card.color}
                  format={'format' in card ? (card.format as 'percentage' | undefined) : undefined}
                  loading={loading}
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
