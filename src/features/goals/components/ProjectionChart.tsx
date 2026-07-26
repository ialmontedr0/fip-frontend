import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { TrendingUp } from 'lucide-react'
import { formatCurrency } from '../constants'
import type { SimulationProjection } from '@/types/goals'

interface ProjectionChartProps {
  projection: SimulationProjection[]
  targetAmount: number
  goalName?: string
  showIncome?: boolean
  showInflationTarget?: boolean
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-3 text-xs space-y-1">
      <p className="font-semibold text-gray-900 dark:text-gray-100">Mes {label}</p>
      {payload.map((entry, idx) => {
        const colors: Record<string, string> = {
          cumulative: '#8b5cf6',
          income_contribution: '#10b981',
          targetAmount: '#ef4444',
          inflation_adjusted_target: '#f59e0b',
        }
        const labels: Record<string, string> = {
          cumulative: 'Acumulado',
          income_contribution: 'Aportacion + Ingresos',
          targetAmount: 'Objetivo',
          inflation_adjusted_target: 'Objetivo (ajustado inflacion)',
        }
        return (
          <p key={idx} className="flex items-center gap-2" style={{ color: colors[entry.name] || '#6b7280' }}>
            <span className="font-medium">{labels[entry.name] || entry.name}:</span>
            {formatCurrency(entry.value)}
          </p>
        )
      })}
    </div>
  )
}

export default function ProjectionChart({ projection, targetAmount, showIncome, showInflationTarget }: ProjectionChartProps) {
  if (!projection || projection.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-center text-gray-400 dark:text-gray-500">
        <TrendingUp className="h-12 w-12 mb-3 opacity-50" />
        <p className="text-sm font-medium">Sin proyeccion</p>
        <p className="text-xs">Ejecuta una simulacion para ver la proyeccion</p>
      </div>
    )
  }

  const hasIncome = showIncome && projection.some((p) => (p.income_contribution ?? 0) > 0)
  const hasInflation = showInflationTarget && projection.some((p) => (p.inflation_adjusted_target ?? 0) > 0)

  const data = projection.map((p) => ({
    month: p.month,
    cumulative: Math.round(p.cumulative * 100) / 100,
    income_contribution: hasIncome ? Math.round((p.income_contribution ?? 0) * 100) / 100 : undefined,
    targetAmount,
    inflation_adjusted_target: hasInflation ? Math.round((p.inflation_adjusted_target ?? 0) * 100) / 100 : undefined,
  }))

  const allValues = [...data.map((d) => d.cumulative), targetAmount]
  if (hasInflation) allValues.push(...data.map((d) => d.inflation_adjusted_target!).filter(Boolean))
  const maxVal = Math.max(...allValues) * 1.1

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-violet-500" />
        <span className="text-xs text-gray-500 dark:text-gray-400">Aportacion acumulada</span>
        {hasIncome && (
          <>
            <div className="h-3 w-3 rounded-full bg-emerald-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">+ Ingresos</span>
          </>
        )}
        <div className="h-0.5 w-6 bg-red-400" />
        <span className="text-xs text-gray-500 dark:text-gray-400">Objetivo: {formatCurrency(targetAmount)}</span>
        {hasInflation && (
          <>
            <div className="h-0.5 w-6 bg-amber-400 border-dashed" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Obj. + Inflacion</span>
          </>
        )}
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="cumulativeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} label={{ value: 'Meses', position: 'insideBottomRight', offset: -5, style: { fontSize: 11, fill: '#9ca3af' } }} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} domain={[0, maxVal]} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={targetAmount} stroke="#ef4444" strokeDasharray="6 4" strokeWidth={2} label={{ value: `Meta: ${formatCurrency(targetAmount)}`, position: 'right', fill: '#ef4444', fontSize: 11 }} />
            {hasInflation && (
              <ReferenceLine y={targetAmount} stroke="#f59e0b" strokeDasharray="3 3" strokeWidth={1.5} label={{ value: 'Obj. + Inflacion', position: 'right', fill: '#f59e0b', fontSize: 10 }} />
            )}
            <Area type="monotone" dataKey="cumulative" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#cumulativeGradient)" dot={false} activeDot={{ r: 5, stroke: '#8b5cf6', strokeWidth: 2, fill: '#fff' }} name="cumulative" />
            {hasIncome && (
              <Area type="monotone" dataKey="income_contribution" stroke="#10b981" strokeWidth={2} fill="url(#incomeGradient)" dot={false} activeDot={{ r: 4, stroke: '#10b981', strokeWidth: 2, fill: '#fff' }} name="income_contribution" />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
