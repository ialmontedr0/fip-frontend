import { cn, formatCurrency } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui'
import { TrendingUp, DollarSign, Calculator, Hash, Receipt, Landmark } from 'lucide-react'

interface KPI {
  label: string
  value: string
  icon: React.ReactNode
  color: string
  bgColor: string
}

interface Props {
  totalIncome: string
  averageMonthly: string
  netIncome: string
  totalCount: number
  grossIncome: string
  totalTaxWithheld: string
  currency?: string
  className?: string
}

export default function SummaryCards({
  totalIncome,
  averageMonthly,
  netIncome,
  totalCount,
  grossIncome,
  totalTaxWithheld,
  currency = 'DOP',
  className,
}: Props) {
  const cards: KPI[] = [
    {
      label: 'Total Ingresos',
      value: formatCurrency(totalIncome, currency),
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-100 dark:bg-emerald-500/10',
    },
    {
      label: 'Promedio Mensual',
      value: formatCurrency(averageMonthly, currency),
      icon: <DollarSign className="h-5 w-5" />,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-500/10',
    },
    {
      label: 'Ingreso Neto',
      value: formatCurrency(netIncome, currency),
      icon: <Calculator className="h-5 w-5" />,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-500/10',
    },
    {
      label: 'Cantidad',
      value: totalCount.toString(),
      icon: <Hash className="h-5 w-5" />,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-100 dark:bg-amber-500/10',
    },
    {
      label: 'Ingreso Bruto',
      value: formatCurrency(grossIncome, currency),
      icon: <Receipt className="h-5 w-5" />,
      color: 'text-cyan-600 dark:text-cyan-400',
      bgColor: 'bg-cyan-100 dark:bg-cyan-500/10',
    },
    {
      label: 'Impuestos (ISR)',
      value: formatCurrency(totalTaxWithheld, currency),
      icon: <Landmark className="h-5 w-5" />,
      color: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-100 dark:bg-rose-500/10',
    },
  ]

  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3', className)}>
      {cards.map((card) => (
        <Card key={card.label} className="border-0 shadow-sm bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className={cn('rounded-lg p-2', card.bgColor)}>
                <span className={card.color}>{card.icon}</span>
              </div>
            </div>
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">{card.label}</p>
            <p className={cn('text-sm font-bold tabular-nums mt-0.5', card.color)}>{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
