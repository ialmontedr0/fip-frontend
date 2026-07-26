import { cn } from '@/lib/utils'
import { Tags, TrendingUp, AlertTriangle, BrainCircuit } from 'lucide-react'

interface QuickActionsGridProps {
  onClassify?: () => void
  onPredict?: () => void
  onDetect?: () => void
  onTrain?: () => void
  className?: string
}

const ACTIONS = [
  { key: 'classify' as const, label: 'Clasificar', desc: 'Clasifica transacciones', icon: Tags, gradient: 'from-purple-500 to-indigo-500' },
  { key: 'predict' as const, label: 'Predecir', desc: 'Predice gastos/ingresos', icon: TrendingUp, gradient: 'from-blue-500 to-cyan-500' },
  { key: 'detect' as const, label: 'Anomalias', desc: 'Detecta anomalias', icon: AlertTriangle, gradient: 'from-rose-500 to-orange-500' },
  { key: 'train' as const, label: 'Entrenar', desc: 'Entrena modelos de IA', icon: BrainCircuit, gradient: 'from-emerald-500 to-green-500' },
]

function QuickActionsGrid({ onClassify, onPredict, onDetect, onTrain, className }: QuickActionsGridProps) {
  const handlers: Record<string, (() => void) | undefined> = {
    classify: onClassify,
    predict: onPredict,
    detect: onDetect,
    train: onTrain,
  }

  return (
    <div className={cn('grid grid-cols-2 lg:grid-cols-4 gap-4', className)}>
      {ACTIONS.map((action, i) => (
        <button
          key={action.key}
          type="button"
          onClick={handlers[action.key]}
          style={{ animationDelay: `${i * 100}ms` }}
          className={cn(
            'group relative overflow-hidden rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5',
            !handlers[action.key] && 'cursor-not-allowed opacity-50',
          )}
        >
          <div className={cn(
            'flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl',
            action.gradient,
          )}>
            <action.icon className="h-5 w-5 text-white" />
          </div>
          <p className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">{action.label}</p>
          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500 leading-relaxed">{action.desc}</p>
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ring-1 ring-inset ring-gray-200/50 dark:ring-gray-600/50" />
        </button>
      ))}
    </div>
  )
}

export default QuickActionsGrid
