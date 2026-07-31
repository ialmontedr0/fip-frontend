import { useAIDashboard, useAnomalyHistory, useRecommendationHistory } from '../hooks/useAI'
import AIPageHeader from '../components/AIPageHeader'
import AINav from '../components/AINav'
import BackButton from '../components/BackButton'
import ScoreGauge from '../components/ScoreGauge'
import QuickActionsGrid from '../components/QuickActionsGrid'
import RecentInsightsFeed from '../components/RecentInsightsFeed'
import { Skeleton } from '@/components/ui'
import { ErrorMessage } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'
import { Lightbulb, PiggyBank } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { RECOMMENDATION_TYPE_LABELS } from '../components/valueMaps'

function AIDashboardPage() {
  const navigate = useNavigate()
  const { data, isLoading, isError, refetch } = useAIDashboard()
  const { data: anomalyHistory } = useAnomalyHistory(5)
  const { data: recHistory } = useRecommendationHistory(5)

  if (isLoading) {
    return (
      <div className="relative space-y-6 animate-fade-in">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return <ErrorMessage message="No se pudo cargar el dashboard de IA" onRetry={() => refetch()} />
  }

  return (
    <div className="relative space-y-8 pb-8 animate-fade-in">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-500/15 animate-[pulse_6s_ease-in-out_infinite]" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-indigo-500/8 blur-3xl dark:bg-indigo-500/12 animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute left-1/4 bottom-0 h-64 w-64 rounded-full bg-violet-500/5 blur-3xl dark:bg-violet-500/8 animate-[pulse_10s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-transparent via-transparent to-gray-100/50 dark:to-gray-950/50" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <BackButton to="/ai" />
        <AIPageHeader title="Panel de IA" subtitle="Resumen de inteligencia financiera" className="flex-1 min-w-[220px]" />
      </div>

      <AINav />

      {data && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col items-center rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm transition-all duration-300 hover:shadow-md">
            <ScoreGauge value={data.habits.score} label="Habitos" size={100} strokeWidth={6} />
          </div>
          <div className="flex flex-col items-center rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm transition-all duration-300 hover:shadow-md">
            <ScoreGauge value={data.risks.health_score} label="Salud Financiera" size={100} strokeWidth={6} />
          </div>
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <PiggyBank className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Ahorros</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {data.savings.estimated_total_savings > 0 ? formatCurrency(data.savings.estimated_total_savings) : 'N/A'}
            </p>
            <p className="text-xs text-gray-400">{data.savings.recommendations_count} recomendaciones</p>
          </div>
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Recomendaciones</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.recommendations.total}</p>
            <p className="text-xs text-gray-400">{data.recommendations.high_priority} de alta prioridad</p>
          </div>
        </div>
      )}

      <QuickActionsGrid
        onClassify={() => navigate('/ai/classify')}
        onPredict={() => navigate('/ai/predict')}
        onDetect={() => navigate('/ai/anomalies')}
        onTrain={() => navigate('/ai/models')}
      />

      <RecentInsightsFeed
        recommendations={recHistory?.recommendations?.map((r) => ({
          type: 'history',
          title: RECOMMENDATION_TYPE_LABELS[r.predicted_value] || r.predicted_value,
          description: r.reason,
          priority: 'medium' as const,
          estimated_savings: 0,
          confidence: r.confidence ?? 0,
        }))}
        anomalies={anomalyHistory?.anomalies?.map((a) => ({
          transaction_id: a.id,
          severity: 'medium' as const,
          reason: a.reason,
        }))}
      />
    </div>
  )
}

export default AIDashboardPage
