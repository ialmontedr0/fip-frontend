import { useSearchParams, useNavigate } from 'react-router-dom'
import { useWallets } from '../hooks/useWallets'
import WalletCard, { WalletCardSkeleton } from '../components/WalletCard'
import { ErrorMessage } from '@/components/ui'
import { cn } from '@/lib/utils'
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd'
import { Plus, Wallet as WalletIcon } from 'lucide-react'
import { Button } from '@/components/ui'
import { WALLET_TYPE_CONFIG } from '@/features/wallets/constants'

const TYPE_FILTERS: Array<{ value: string; label: string; gradient: string }> = [
  { value: '', label: 'Todos', gradient: 'from-primary-400 to-primary-600' },
  ...Object.entries(WALLET_TYPE_CONFIG).map(([key, config]) => ({
    value: key,
    label: config.label,
    gradient: config.gradient ?? 'from-gray-400 to-gray-600',
  })),
]

export default function WalletListPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeType = searchParams.get('type') || ''
  const { data, isLoading, isError, error } = useWallets(
    activeType ? { wallet_type: activeType } : undefined,
  )

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !data) return
  }

  return (
    <div className="relative space-y-6 pb-8">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -left-32 -top-20 h-72 w-72 rounded-full bg-gradient-to-br from-violet-200/30 to-primary-200/20 blur-3xl dark:from-violet-500/10 dark:to-primary-500/5" />
      <div className="pointer-events-none absolute -right-20 top-40 h-56 w-56 rounded-full bg-gradient-to-br from-fuchsia-200/20 to-sky-200/20 blur-3xl dark:from-fuchsia-500/5 dark:to-sky-500/5" />

      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-3 w-3 rounded-full bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.5)]" />
              <div className="absolute -inset-1 animate-ping rounded-full bg-violet-400/30" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Wallets</h1>
          </div>
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            Agrupa tus cuentas en wallets financieros
          </p>
        </div>
        <Button onClick={() => navigate('/wallets/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Wallet
        </Button>
      </div>

      {/* Type Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
        {TYPE_FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => {
              const params = new URLSearchParams(searchParams)
              if (filter.value) params.set('type', filter.value)
              else params.delete('type')
              setSearchParams(params)
            }}
            className={cn(
              'relative overflow-hidden whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200',
              activeType === filter.value
                ? 'bg-gradient-to-r text-white shadow-md shadow-violet-500/20'
                : 'bg-white/70 text-gray-600 hover:bg-white hover:shadow-sm dark:bg-gray-800/70 dark:text-gray-400 dark:hover:bg-gray-800',
              activeType === filter.value && filter.gradient,
            )}
          >
            <span className="relative z-10">{filter.label}</span>
          </button>
        ))}
      </div>

      {/* Error State */}
      {isError && (
        <div className="animate-fade-in">
          <ErrorMessage
            message={(error as Error)?.message || 'Error al cargar los wallets'}
            onRetry={() => window.location.reload()}
          />
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <WalletCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && data?.wallets.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
          <div className="mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 p-5 dark:from-gray-800 dark:to-gray-700">
            <WalletIcon className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            No tienes wallets aun
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-xs text-center">
            Crea un wallet para agrupar tus cuentas por proposito.
          </p>
          <Button onClick={() => navigate('/wallets/new')} size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Crear Wallet
          </Button>
        </div>
      )}

      {/* Wallet Grid */}
      {!isLoading && !isError && data && data.wallets.length > 0 && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="wallets" direction="vertical">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                {data.wallets.map((wallet, index) => (
                  <Draggable key={wallet.id} draggableId={wallet.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={cn(
                          snapshot.isDragging && 'opacity-80 rotate-1 scale-105',
                        )}
                      >
                        <WalletCard wallet={wallet} index={index} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  )
}
