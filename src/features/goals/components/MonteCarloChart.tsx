import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { Brain } from 'lucide-react'
import { formatCurrency } from '../constants'
import type { MonteCarloPoint } from '@/types/goals'

interface MonteCarloChartProps {
  data: MonteCarloPoint[]
  targetAmount: number
}

function MCTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-3 text-xs space-y-1">
      <p className="font-semibold text-gray-900 dark:text-gray-100">Mes {label}</p>
      {payload.map((entry, idx) => {
        const colors: Record<string, string> = {
          p95: '#8b5cf6',
          p75: '#a78bfa',
          p50: '#c4b5fd',
          p25: '#ddd6fe',
          p5: '#ede9fe',
        }
        const labels: Record<string, string> = {
          p95: 'Optimista (95%)',
          p75: 'Favorable (75%)',
          p50: 'Mediana (50%)',
          p25: 'Desfavorable (25%)',
          p5: ' Pesimista (5%)',
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

export default function MonteCarloChart({ data, targetAmount }: MonteCarloChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-center text-gray-400 dark:text-gray-500">
        <Brain className="h-12 w-12 mb-3 opacity-50" />
        <p className="text-sm font-medium">Sin datos Monte Carlo</p>
        <p className="text-xs">Activa la opcion en Avanzado para ver la distribucion de probabilidad</p>
      </div>
    )
  }

  const maxVal = Math.max(...data.map((d) => d.p95), targetAmount) * 1.1

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Brain className="h-4 w-4 text-violet-500" />
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Distribucion Monte Carlo</span>
        <span className="text-[10px] text-gray-400">(percentiles)</span>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-[10px] text-gray-500">
        <span className="flex items-center gap-1"><span className="h-2 w-4 rounded bg-violet-500" /> P95 (optimista)</span>
        <span className="flex items-center gap-1"><span className="h-2 w-4 rounded bg-violet-400" /> P75</span>
        <span className="flex items-center gap-1"><span className="h-2 w-4 rounded bg-violet-300" /> P50 (mediana)</span>
        <span className="flex items-center gap-1"><span className="h-2 w-4 rounded bg-violet-200" /> P25</span>
        <span className="flex items-center gap-1"><span className="h-2 w-4 rounded bg-violet-100" /> P5 (pesimista)</span>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="mcP95" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="mcP75" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="mcP50" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c4b5fd" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#c4b5fd" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} domain={[0, maxVal]} />
            <Tooltip content={<MCTooltip />} />
            <Area type="monotone" dataKey="p95" stroke="#8b5cf6" strokeWidth={1.5} fill="url(#mcP95)" dot={false} />
            <Area type="monotone" dataKey="p75" stroke="#a78bfa" strokeWidth={1.5} fill="url(#mcP75)" dot={false} />
            <Area type="monotone" dataKey="p50" stroke="#c4b5fd" strokeWidth={2} fill="url(#mcP50)" dot={false} />
            <Area type="monotone" dataKey="p25" stroke="#ddd6fe" strokeWidth={1} fill="none" dot={false} />
            <Area type="monotone" dataKey="p5" stroke="#ede9fe" strokeWidth={1} fill="none" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
