import { BrainCircuit, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyAiStateProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

function EmptyAiState({
  title = 'No hay datos de IA',
  description = 'Comienza usando las herramientas de IA para obtener informacion.',
  icon,
  action,
  className,
}: EmptyAiStateProps) {
  return (
    <div className={cn('relative flex flex-col items-center justify-center py-16 text-center overflow-hidden', className)}>
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, #7c3aed 0%, transparent 50%), radial-gradient(circle at 75% 75%, #4f46e5 0%, transparent 50%)' }} />
      </div>
      <div className="relative mb-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 shadow-lg shadow-purple-500/15 transition-all duration-500 hover:shadow-xl hover:shadow-purple-500/25 hover:scale-105"
          style={{ animation: 'bob 3s ease-in-out infinite' }}>
          {icon || <BrainCircuit className="h-10 w-10 text-purple-500 dark:text-purple-400" />}
        </div>
        <div className="absolute -right-1 -top-1">
          <Sparkles className="h-5 w-5 text-amber-400 animate-[spin_4s_linear_infinite]" />
        </div>
      </div>
      <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md">{description}</p>
      {action}
      <style>{`
        @keyframes bob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  )
}

export default EmptyAiState
