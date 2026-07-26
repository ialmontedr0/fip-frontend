import { Target } from 'lucide-react'

interface EmptyGoalStateProps {
  onCreateClick?: () => void
  message?: string
  subtitle?: string
}

export default function EmptyGoalState({
  onCreateClick,
  message = 'No tienes metas financieras',
  subtitle = 'Define tu primera meta para empezar a seguir tu progreso',
}: EmptyGoalStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-500/10 dark:to-purple-500/10 mb-6">
        <Target className="h-10 w-10 text-violet-500 dark:text-violet-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {message}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
        {subtitle}
      </p>
      {onCreateClick && (
        <button
          type="button"
          onClick={onCreateClick}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25 transition-all duration-200"
        >
          <Target className="h-4 w-4" />
          Crear Primera Meta
        </button>
      )}
    </div>
  )
}
