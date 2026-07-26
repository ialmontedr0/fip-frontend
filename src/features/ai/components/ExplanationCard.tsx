import type { ExplanationResponse } from '@/types/ai'
import { cn } from '@/lib/utils'
import { EXPLANATION_TONE_STYLES } from './valueMaps'
import ConfidenceBadge from './ConfidenceBadge'
import PriorityBadge from './PriorityBadge'
import { formatCurrency } from '@/lib/utils'
import { Sparkles, Lightbulb, Target, ArrowRight, Shield, PiggyBank } from 'lucide-react'

interface ExplanationCardProps {
  explanation: ExplanationResponse
  className?: string
}

const SECTION_ICONS = {
  why: Lightbulb,
  how: Target,
  impact: Shield,
  action: ArrowRight,
} as const

const SECTION_COLORS = {
  why: 'from-amber-400 to-yellow-500 shadow-amber-500/20',
  how: 'from-blue-400 to-cyan-500 shadow-blue-500/20',
  impact: 'from-emerald-400 to-green-500 shadow-emerald-500/20',
  action: 'from-purple-400 to-violet-500 shadow-purple-500/20',
} as const

const SECTION_HEADINGS = {
  why: 'Por que',
  how: 'Como',
  impact: 'Impacto',
  action: 'Accion',
} as const

function ExplanationCard({ explanation, className }: ExplanationCardProps) {
  const toneStyle = EXPLANATION_TONE_STYLES[explanation.tone] || EXPLANATION_TONE_STYLES.informative
  const toneBorderClass = toneStyle.split(' ')[0]

  const sections = [
    { key: 'why' as const, text: explanation.why },
    { key: 'how' as const, text: explanation.how },
    { key: 'impact' as const, text: explanation.impact },
    { key: 'action' as const, text: explanation.action },
  ]

  return (
    <div className={cn(
      'rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm transition-all duration-300',
      'hover:shadow-lg hover:-translate-y-0.5 hover:border-gray-200/80 dark:hover:border-gray-600/80',
      'relative overflow-hidden',
      className,
    )}>
      <div className={cn('absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b', toneBorderClass === 'border-l-blue-500' ? 'from-blue-500 to-cyan-500' : toneBorderClass === 'border-l-emerald-500' ? 'from-emerald-500 to-green-500' : toneBorderClass === 'border-l-amber-500' ? 'from-amber-500 to-orange-500' : toneBorderClass === 'border-l-red-500' ? 'from-red-500 to-rose-500' : 'from-blue-500 to-cyan-500')} />
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-purple-400 to-violet-500 shadow-md shadow-purple-500/20">
          <Sparkles className="h-3.5 w-3.5 text-white" />
        </div>
        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Explicacion IA</span>
      </div>

      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{explanation.headline}</h3>

      <div className="flex items-center gap-2 mb-4">
        <PriorityBadge priority={explanation.priority} />
        <ConfidenceBadge value={explanation.confidence} />
      </div>

      <div className="space-y-3">
        {sections.map(({ key, text }) => {
          const Icon = SECTION_ICONS[key]
          return (
            <div
              key={key}
              className="rounded-xl bg-gray-50/50 dark:bg-gray-800/30 p-3.5 border border-gray-100/50 dark:border-gray-700/30 transition-all duration-200 hover:bg-gray-50/80 dark:hover:bg-gray-800/50"
            >
              <div className="flex gap-3">
                <div className={cn('flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br shadow-md flex-shrink-0 mt-0.5', SECTION_COLORS[key])}>
                  <Icon className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">{SECTION_HEADINGS[key]}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{text}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {explanation.estimated_savings > 0 && (
        <div className="mt-4 rounded-xl bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50 dark:from-emerald-500/10 dark:via-green-500/10 dark:to-emerald-500/10 px-4 py-3.5 border border-emerald-200/50 dark:border-emerald-700/30 relative overflow-hidden group/save">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover/save:opacity-100 transition-opacity duration-500" />
          <div className="flex items-center gap-2.5 relative">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg shadow-emerald-500/20 animate-pulse">
              <PiggyBank className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Ahorro estimado</p>
              <p className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent">
                {formatCurrency(explanation.estimated_savings)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExplanationCard
