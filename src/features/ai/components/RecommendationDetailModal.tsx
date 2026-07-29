import { useState } from 'react'
import type { RecommendationItem, ExplanationResponse } from '@/types/ai'
import { useExplanation } from '../hooks/useAI'
import { Modal } from '@/components/ui'
import PriorityBadge from './PriorityBadge'
import ConfidenceBadge from './ConfidenceBadge'
import ExplanationCard from './ExplanationCard'
import { formatCurrency } from '@/lib/utils'
import { Lightbulb, Sparkles, PiggyBank, Loader2, FileText } from 'lucide-react'

interface RecommendationDetailModalProps {
  rec: RecommendationItem | null
  isOpen: boolean
  onClose: () => void
}

function RecommendationDetailModal({ rec, isOpen, onClose }: RecommendationDetailModalProps) {
  const explainMutation = useExplanation()
  const [explanation, setExplanation] = useState<ExplanationResponse | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)

  if (!rec) return null

  const handleExplain = () => {
    if (explanation) {
      setShowExplanation(!showExplanation)
      return
    }
    explainMutation.mutate(
      {
        rec_type: rec.type,
        title: rec.title,
        description: rec.description,
        priority: rec.priority,
        estimated_savings: rec.estimated_savings,
        confidence: rec.confidence,
      },
      {
        onSuccess: (data) => {
          setExplanation(data)
          setShowExplanation(true)
        },
      },
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="space-y-5">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/20">
            <Lightbulb className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{rec.title}</h3>
            <div className="flex items-center gap-2 mt-1.5">
              <PriorityBadge priority={rec.priority} />
              <ConfidenceBadge value={rec.confidence} />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-gray-50/80 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/30 p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <FileText className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{rec.type}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{rec.description}</p>
        </div>

        {rec.estimated_savings > 0 && (
          <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-500/10 dark:to-green-500/10 border border-emerald-200/50 dark:border-emerald-700/30 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg shadow-emerald-500/20">
                <PiggyBank className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Ahorro estimado</p>
                <p className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent">
                  {formatCurrency(rec.estimated_savings)}
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleExplain}
          disabled={explainMutation.isPending}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold bg-gradient-to-r from-purple-500 to-violet-500 text-white hover:from-purple-600 hover:to-violet-600 transition-all disabled:opacity-60 shadow-lg shadow-purple-500/20"
        >
          {explainMutation.isPending ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Generando explicacion...</>
          ) : showExplanation && explanation ? (
            <><Sparkles className="h-4 w-4" /> Ocultar explicacion</>
          ) : (
            <><Sparkles className="h-4 w-4" /> {explanation ? 'Ver explicacion' : 'Explicame con IA'}</>
          )}
        </button>

        {showExplanation && explanation && (
          <div className="animate-fade-in">
            <ExplanationCard explanation={explanation} />
          </div>
        )}
      </div>
    </Modal>
  )
}

export default RecommendationDetailModal