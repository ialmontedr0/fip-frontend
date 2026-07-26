import { useRiskAssessment } from '../hooks/useAI'
import HealthScoreGauge from './HealthScoreGauge'
import RiskFactorCard from './RiskFactorCard'
import RiskMetricsGrid from './RiskMetricsGrid'
import RiskRecommendationsList from './RiskRecommendationsList'
import { Skeleton } from '@/components/ui'
import { ErrorMessage } from '@/components/ui'
function RiskAssessmentPanel() {
  const { data, isLoading, isError, refetch } = useRiskAssessment()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center">
          <Skeleton variant="circular" className="h-48 w-48" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return <ErrorMessage message="No se pudo cargar la evaluacion de riesgos" onRetry={() => refetch()} />
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-gray-400">
        Sin datos de riesgo disponibles
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-6 shadow-sm">
          <HealthScoreGauge value={data.financial_health_score} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {data.risk_factors.map((factor, i) => (
          <RiskFactorCard key={factor.factor} factor={factor} index={i} />
        ))}
      </div>

      <RiskMetricsGrid metrics={data.metrics} />
      <RiskRecommendationsList recommendations={data.recommendations} />
    </div>
  )
}

export default RiskAssessmentPanel
