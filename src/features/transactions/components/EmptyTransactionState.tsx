import { ArrowLeftRight, FilterX } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

interface Props {
  hasFilters?: boolean
  onClearFilters?: () => void
  onCreateClick?: () => void
  className?: string
}

export default function EmptyTransactionState({ hasFilters, onClearFilters, onCreateClick, className }: Props) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4', className)}>
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-200/30 to-primary-400/10 rounded-full blur-2xl" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 shadow-xl">
          {hasFilters ? (
            <FilterX className="h-9 w-9 text-amber-500" />
          ) : (
            <ArrowLeftRight className="h-9 w-9 text-primary-500" />
          )}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {hasFilters ? 'Sin resultados' : 'No hay transacciones'}
      </h3>

      <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm mb-6">
        {hasFilters
          ? 'No se encontraron transacciones con los filtros actuales. Intenta con otros criterios de busqueda.'
          : 'Aun no has registrado ninguna transaccion. Comienza a llevar el control de tus finanzas agregando tu primer movimiento.'}
      </p>

      <div className="flex gap-3">
        {hasFilters && onClearFilters && (
          <Button variant="outline" onClick={onClearFilters} className="rounded-xl">
            <FilterX className="h-4 w-4 mr-2" />
            Limpiar Filtros
          </Button>
        )}
        {!hasFilters && onCreateClick && (
          <Button onClick={onCreateClick} className="rounded-xl shadow-lg shadow-primary-500/20">
            <ArrowLeftRight className="h-4 w-4 mr-2" />
            Nueva Transaccion
          </Button>
        )}
      </div>
    </div>
  )
}
