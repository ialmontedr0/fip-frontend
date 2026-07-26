import { useState, useEffect, useRef } from 'react'
import type { SpendingHeatmapResponse } from '@/types/analytics'
import { Skeleton, ErrorMessage } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Flame, TrendingUp, CalendarDays, DollarSign, Info, Activity } from 'lucide-react'

interface Props {
  heatmap: SpendingHeatmapResponse | undefined
  loading: boolean
  error: boolean
}

function HeatmapSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Skeleton variant="circular" className="h-8 w-8" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>
      <Skeleton variant="rectangular" className="h-[300px] w-full rounded-xl" />
      <div className="flex items-center justify-between mt-4">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  )
}

function getHeatGradient(value: number, max: number): string {
  if (max === 0 || value === 0) return 'from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-750'
  const ratio = value / max
  if (ratio <= 0.1) return 'from-emerald-200/60 to-emerald-300/60 dark:from-emerald-950/60 dark:to-emerald-900/60'
  if (ratio <= 0.25) return 'from-emerald-300/70 to-teal-400/70 dark:from-emerald-900/70 dark:to-teal-800/70'
  if (ratio <= 0.4) return 'from-teal-400/80 to-cyan-400/80 dark:from-teal-800/80 dark:to-cyan-700/80'
  if (ratio <= 0.55) return 'from-cyan-400/90 to-sky-500/90 dark:from-cyan-700/90 dark:to-sky-600/90'
  if (ratio <= 0.7) return 'from-sky-500 to-blue-500 dark:from-sky-600 dark:to-blue-500'
  if (ratio <= 0.85) return 'from-blue-500 to-indigo-500 dark:from-blue-500 dark:to-indigo-400'
  return 'from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400'
}

export default function SpendingHeatmap({ heatmap, loading, error }: Props) {
  const [tooltip, setTooltip] = useState<{
    day: string
    month: string
    total: number
    ratio: number
    x: number
    y: number
  } | null>(null)
  const [visible, setVisible] = useState(false)
  const [hoveredCell, setHoveredCell] = useState<{ dow: number; m: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <HeatmapSkeleton />
  if (error) {
    return (
      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <div className="flex h-[350px] flex-col items-center justify-center gap-3">
          <Flame className="h-10 w-10 text-orange-300 dark:text-orange-600" />
          <ErrorMessage message="No se pudo cargar el mapa de calor" />
        </div>
      </div>
    )
  }
  if (!heatmap || heatmap.data.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <div className="flex h-[350px] flex-col items-center justify-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-500/10 dark:to-amber-500/10">
            <Flame className="h-7 w-7 text-orange-400 dark:text-orange-500" />
          </div>
          <p className="text-sm font-medium text-gray-400 dark:text-gray-500">Sin datos de gastos en este periodo</p>
        </div>
      </div>
    )
  }

  const { data, days, months, max_value } = heatmap
  const monthsArr = months || []
  const activeCells = data.filter((d) => d.total > 0)
  const totalSpent = data.reduce((sum, d) => sum + d.total, 0)
  const avgPerCell = activeCells.length > 0 ? totalSpent / activeCells.length : 0
  const busiestMonth = monthsArr.reduce(
    (best, _, i) => {
      const monthTotal = data.filter((d) => d.month === i + 1).reduce((s, d) => s + d.total, 0)
      return monthTotal > best.total ? { month: monthsArr[i], total: monthTotal } : best
    },
    { month: '', total: 0 },
  )
  const busiestDay = days.reduce(
    (best, day, dow) => {
      const dayTotal = data.filter((d) => d.day_of_week === dow).reduce((s, d) => s + d.total, 0)
      return dayTotal > best.total ? { day, total: dayTotal } : best
    },
    { day: '', total: 0 },
  )

  const getCell = (dow: number, monthIdx: number) =>
    data.find((d) => d.day_of_week === dow && d.month === monthIdx + 1)

  return (
    <div
      ref={containerRef}
      className={cn(
        'group relative overflow-hidden rounded-2xl border transition-all duration-500',
        'bg-white dark:bg-gray-900 p-6 shadow-sm',
        'hover:shadow-xl hover:border-gray-200 dark:hover:border-gray-700',
        'hover:-translate-y-0.5',
      )}
    >
      {/* Gradient top bar */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-400 via-red-400 to-pink-500 dark:from-orange-500 dark:via-red-500 dark:to-pink-600" />
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-orange-500/[0.03] to-transparent dark:from-orange-500/[0.05]" />

      {/* Header */}
      <div className="relative mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 shadow-lg shadow-orange-500/20">
              <Flame className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Mapa de Calor de Gastos
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {heatmap.start} — {heatmap.end}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="rounded-lg bg-orange-50 px-2.5 py-1.5 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
            <span className="font-semibold">{activeCells.length}</span> activos
          </div>
          <div className="rounded-lg bg-gray-50 px-2.5 py-1.5 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            {data.length} celdas
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="relative mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { icon: DollarSign, label: 'Total Gastado', value: formatCurrency(totalSpent), color: 'from-orange-500 to-rose-500', bg: 'bg-orange-50 dark:bg-orange-500/5' },
          { icon: Activity, label: 'Promedio x Celda', value: formatCurrency(avgPerCell), color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50 dark:bg-blue-500/5' },
          { icon: CalendarDays, label: 'Mes Activo', value: busiestMonth.month, color: 'from-violet-500 to-purple-500', bg: 'bg-violet-50 dark:bg-violet-500/5' },
          { icon: TrendingUp, label: 'Dia Activo', value: busiestDay.day, color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50 dark:bg-emerald-500/5' },
        ].map((item, i) => (
          <div
            key={item.label}
            className={cn(
              'group/card relative overflow-hidden rounded-xl p-3 transition-all duration-300',
              'hover:shadow-md hover:-translate-y-0.5',
              item.bg,
            )}
            style={{
              animation: `fadeIn 0.5s ease-out ${0.1 + i * 0.08}s both`,
            }}
          >
            <div className="absolute -right-3 -top-3 h-12 w-12 rounded-full bg-gradient-to-br opacity-0 transition-all duration-500 group-hover/card:opacity-20 dark:opacity-[0.08] dark:group-hover/card:opacity-[0.15]" />
            <div className="relative">
              <div className={cn(
                'mb-1.5 inline-flex rounded-lg p-1.5 bg-gradient-to-br text-white shadow-sm',
                item.color,
              )}>
                <item.icon className="h-3.5 w-3.5" />
              </div>
              <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">{item.label}</p>
              <p className="mt-0.5 text-sm font-bold text-gray-900 dark:text-gray-100 tabular-nums truncate">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Heatmap grid */}
      <div className="relative overflow-x-auto rounded-xl border border-gray-100 bg-gray-50/50 p-3 dark:border-gray-800 dark:bg-gray-800/30">
        <table className="w-full min-w-[520px] border-collapse">
          <thead>
            <tr>
              <th className="w-12 p-1.5" />
              {monthsArr.map((m, i) => (
                <th
                  key={i}
                  className="p-1.5 text-center text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider"
                  style={{ animation: `fadeIn 0.4s ease-out ${0.2 + i * 0.05}s both` }}
                >
                  {m}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((dayName, dow) => (
              <tr key={dow}>
                <td className="p-1.5 text-right text-[10px] font-semibold text-gray-400 dark:text-gray-500 whitespace-nowrap">
                  {dayName}
                </td>
                {monthsArr.map((_, monthIdx) => {
                  const cell = getCell(dow, monthIdx)
                  const value = cell?.total ?? 0
                  const ratio = max_value > 0 ? value / max_value : 0
                  const isHovered = hoveredCell?.dow === dow && hoveredCell?.m === monthIdx
                  const isActive = value > 0
                  const isMax = value === max_value && max_value > 0
                  const cellDelay = 0.3 + dow * 0.04 + monthIdx * 0.015

                  return (
                    <td
                      key={monthIdx}
                      className="p-1"
                      onMouseEnter={(e) => {
                        setHoveredCell({ dow, m: monthIdx })
                        const rect = e.currentTarget.getBoundingClientRect()
                        setTooltip({
                          day: dayName,
                          month: monthsArr[monthIdx],
                          total: value,
                          ratio,
                          x: rect.left + rect.width / 2,
                          y: rect.top - 8,
                        })
                      }}
                      onMouseLeave={() => { setHoveredCell(null); setTooltip(null) }}
                    >
                      <div
                        className={cn(
                          'relative h-9 w-full overflow-hidden rounded-lg transition-all duration-300',
                          'cursor-default',
                          isActive
                            ? 'shadow-sm'
                            : 'opacity-40',
                          isHovered && isActive && 'ring-2 ring-primary-400/60 shadow-lg scale-110 z-10',
                          isMax && 'ring-2 ring-amber-400/50 shadow-lg shadow-amber-500/20',
                        )}
                        style={{
                          animation: visible ? `cellFadeIn 0.5s ease-out ${cellDelay}s both` : 'none',
                        }}
                      >
                        <div
                          className={cn(
                            'absolute inset-0 bg-gradient-to-br transition-all duration-500',
                            getHeatGradient(value, max_value),
                            isHovered && isActive && 'brightness-110 saturate-125',
                          )}
                        />
                        {isMax && (
                          <div className="absolute -right-2 -top-2 h-5 w-5 animate-pulse">
                            <div className="h-full w-full rounded-full bg-amber-400/40 blur-sm" />
                          </div>
                        )}
                        {isActive && (
                          <span className={cn(
                            'absolute inset-0 flex items-center justify-center text-[9px] font-bold transition-all duration-200',
                            ratio > 0.4 ? 'text-white drop-shadow-sm' : 'text-gray-700 dark:text-gray-300',
                            isHovered && 'scale-110',
                          )}>
                            {formatCurrency(value)
                              .replace(/[^0-9,.]/g, '')
                              .replace(/\.\d+$/, '')
                              .slice(0, 7)}
                          </span>
                        )}
                        {!isActive && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[8px] text-gray-300 dark:text-gray-600">-</span>
                          </div>
                        )}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend + Stats */}
      <div className="relative mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500">Bajo</span>
          <div className="flex gap-0.5 overflow-hidden rounded-lg border border-gray-200/50 p-0.5 dark:border-gray-700/50">
            {[0, 0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1].map((ratio) => (
              <div
                key={ratio}
                className={cn(
                  'h-3.5 w-3.5 rounded-sm transition-transform hover:scale-125',
                  getHeatGradient(ratio * max_value, max_value),
                )}
              />
            ))}
          </div>
          <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500">Alto</span>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
            <Info className="h-3 w-3" />
            <span>{activeCells.length} celdas activas</span>
          </div>
          <div className="h-3 w-px bg-gray-200 dark:bg-gray-700" />
          <span className="text-gray-400 dark:text-gray-500">
            Max: <span className="font-semibold text-gray-600 dark:text-gray-300">{formatCurrency(max_value)}</span>
          </span>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-[100] -translate-x-1/2 pointer-events-none"
          style={{ left: tooltip.x, top: tooltip.y - 12 }}
        >
          <div className={cn(
            'rounded-xl border px-3.5 py-2.5 shadow-xl backdrop-blur-md',
            'animate-fade-in',
            tooltip.total > 0
              ? 'border-gray-200/80 bg-white/95 dark:border-gray-700/80 dark:bg-gray-800/95'
              : 'border-gray-100 bg-gray-50/95 dark:border-gray-800 dark:bg-gray-900/95',
          )}>
            <div className="flex items-center gap-2 mb-1">
              <div className={cn(
                'h-2 w-2 rounded-full',
                tooltip.total > 0 ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600',
              )} />
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {tooltip.day} &middot; {tooltip.month}
              </p>
            </div>
            {tooltip.total > 0 ? (
              <>
                <p className="text-base font-bold text-gray-900 dark:text-gray-100 tabular-nums">
                  {formatCurrency(tooltip.total)}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-orange-500 to-rose-500 transition-all"
                      style={{ width: `${Math.min(tooltip.ratio * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500">
                    {(tooltip.ratio * 100).toFixed(0)}%
                  </span>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-400 dark:text-gray-500">Sin gastos</p>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes cellFadeIn {
          from { opacity: 0; transform: scale(0.85) translateY(4px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}
