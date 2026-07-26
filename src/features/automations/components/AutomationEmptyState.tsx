import { Bot, Sparkles } from 'lucide-react'

interface AutomationEmptyStateProps {
  onAction?: () => void
}

export default function AutomationEmptyState({ onAction }: AutomationEmptyStateProps) {
  return (
    <div className="relative flex flex-col items-center justify-center py-16 px-4 text-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-indigo-500/5" />
      <div className="absolute top-12 left-1/4 h-3 w-3 rounded-full bg-purple-400/20 animate-pulse" style={{ animationDelay: '0.2s' }} />
      <div className="absolute top-20 right-1/4 h-2 w-2 rounded-full bg-indigo-400/20 animate-pulse" style={{ animationDelay: '0.6s' }} />
      <div className="absolute bottom-20 left-1/3 h-4 w-4 rounded-full bg-purple-400/10 animate-pulse" style={{ animationDelay: '0.4s' }} />
      <div className="absolute bottom-16 right-1/3 h-2.5 w-2.5 rounded-full bg-indigo-400/15 animate-pulse" style={{ animationDelay: '0.8s' }} />

      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 blur-2xl animate-pulse" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-200/50 dark:border-purple-500/30 shadow-lg shadow-purple-500/10">
          <div className="absolute inset-0 rounded-full animate-spin-slow border-2 border-dashed border-purple-300/30 dark:border-purple-500/20" />
          <Bot className="h-10 w-10 text-purple-600 dark:text-purple-400 animate-float" />
        </div>
        <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-purple-400 animate-pulse" />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        No hay reglas de automatizacion
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md">
        Crea tu primera regla para automatizar ahorros, pagos de tarjetas, transferencias por saldo y mas.
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2.5 text-sm font-semibold shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.97] group"
        >
          <Bot className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
          + Crear primera regla
          <Sparkles className="h-3.5 w-3.5 opacity-0 -ml-1.5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
        </button>
      )}
    </div>
  )
}
