import { Target, TrendingUp, CheckCircle2, Zap } from 'lucide-react'
import { formatCurrency } from '../constants'
import type { RecommendationPoint } from '@/types/goals'

interface RecommendationCardProps {
  recommendations: RecommendationPoint[]
  currentContribution: number
  targetAmount: number
}

export default function RecommendationCard({ recommendations, currentContribution }: RecommendationCardProps) {
  if (!recommendations || recommendations.length === 0) return null

  const currentRec = recommendations.find(
    (r) => Math.abs(r.contribution - currentContribution) / currentContribution < 0.15
  ) || recommendations[0]

  const bestRec = recommendations.reduce((best, r) =>
    r.probability > best.probability ? r : best
  )

  const quickestRec = recommendations.reduce((fastest, r) =>
    r.months < fastest.months && r.probability >= 0.8 ? r : fastest,
    recommendations[0]
  )

  return (
    <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-500/10 dark:to-purple-500/10 rounded-2xl border border-violet-200 dark:border-violet-500/20 shadow-sm p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Zap className="h-5 w-5 text-violet-500" />
        <h3 className="text-sm font-semibold text-violet-700 dark:text-violet-300">Recomendaciones</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-gray-800/60 rounded-xl p-3 border border-violet-100 dark:border-violet-500/20">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp className="h-3.5 w-3.5 text-violet-500" />
            <p className="text-[10px] text-gray-500 dark:text-gray-400">Aportacion actual</p>
          </div>
          <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{formatCurrency(currentContribution)}/mes</p>
          {currentRec && (
            <p className="text-xs text-violet-600 dark:text-violet-400 mt-0.5">
              Prob: {(currentRec.probability * 100).toFixed(0)}% · {currentRec.months} meses
            </p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800/60 rounded-xl p-3 border border-emerald-200 dark:border-emerald-500/20">
          <div className="flex items-center gap-1.5 mb-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <p className="text-[10px] text-gray-500 dark:text-gray-400">Mejor probabilidad</p>
          </div>
          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(bestRec.contribution)}/mes</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
            {(bestRec.probability * 100).toFixed(0)}% · {bestRec.months} meses
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800/60 rounded-xl p-3 border border-amber-200 dark:border-amber-500/20">
          <div className="flex items-center gap-1.5 mb-1">
            <Target className="h-3.5 w-3.5 text-amber-500" />
            <p className="text-[10px] text-gray-500 dark:text-gray-400">Mas rapido (80%+)</p>
          </div>
          <p className="text-sm font-bold text-amber-600 dark:text-amber-400">{formatCurrency(quickestRec.contribution)}/mes</p>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
            {quickestRec.months} meses · {(quickestRec.probability * 100).toFixed(0)}%
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800/40 rounded-xl p-3">
        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Proyeccion de probabilidad por aportacion</p>
        <div className="space-y-1.5">
          {recommendations.slice(0, 6).map((rec, idx) => {
            const pct = rec.probability * 100
            return (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 dark:text-gray-400 w-20 shrink-0">{formatCurrency(rec.contribution)}/mes</span>
                <div className="flex-1 h-4 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(pct, 5)}%`,
                      background: pct >= 80 ? 'linear-gradient(90deg, #10b981, #059669)' :
                        pct >= 50 ? 'linear-gradient(90deg, #f59e0b, #d97706)' :
                          'linear-gradient(90deg, #ef4444, #dc2626)',
                    }}
                  />
                </div>
                <span className="text-xs font-medium w-16 text-right text-gray-700 dark:text-gray-300">
                  {pct.toFixed(0)}%
                </span>
                <span className="text-xs text-gray-400 w-12 text-right">{rec.months}m</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
