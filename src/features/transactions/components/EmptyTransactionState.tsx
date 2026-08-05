import { EmptyState } from '@/components/ui'
import { cn } from '@/lib/utils'

interface Props {
  hasFilters?: boolean
  onClearFilters?: () => void
  onCreateClick?: () => void
  className?: string
}

export default function EmptyTransactionState({ hasFilters, onClearFilters, onCreateClick, className }: Props) {
  const actionLabel = hasFilters ? 'Limpiar Filtros' : 'Nueva Transaccion'
  const onAction = hasFilters ? onClearFilters : onCreateClick

  return (
    <div className={cn('py-8', className)}>
      <EmptyState
        title={hasFilters ? 'Sin resultados' : 'No hay transacciones'}
        description={
          hasFilters
            ? 'No se encontraron transacciones con los filtros actuales. Intenta con otros criterios de busqueda.'
            : 'Aun no has registrado ninguna transaccion. Comienza a llevar el control de tus finanzas agregando tu primer movimiento.'
        }
        actionLabel={actionLabel}
        onAction={onAction}
      />
    </div>
  )
}
