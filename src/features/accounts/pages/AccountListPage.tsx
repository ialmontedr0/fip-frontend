import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAccounts } from '../hooks/useAccounts'
import AccountCard, { AccountCardSkeleton } from '../components/AccountCard'
import AccountSummaryWidget from '../components/AccountSummaryWidget'
import { ErrorMessage } from '@/components/ui'
import { cn } from '@/lib/utils'
import { Plus, Banknote } from 'lucide-react'
import { ACCOUNT_TYPE_CONFIG } from '@/features/accounts/constants'
import { Button } from '@/components/ui'

const TYPE_FILTERS: Array<{ value: string; label: string; color: string }> = [
  { value: '', label: 'Todas', color: 'from-primary-400 to-primary-600' },
  ...Object.entries(ACCOUNT_TYPE_CONFIG).map(([key, config]) => ({
    value: key,
    label: config.label,
    color: config.gradient ?? 'from-gray-400 to-gray-600',
  })),
]

export default function AccountListPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeType = searchParams.get('type') || ''
  const { data, isLoading, isError, error } = useAccounts(
    activeType ? { account_type: activeType } : undefined,
  )

  return (
    <div className="relative space-y-6 pb-8">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -left-32 -top-20 h-72 w-72 rounded-full bg-gradient-to-br from-primary-200/30 to-purple-200/20 blur-3xl dark:from-primary-500/10 dark:to-purple-500/5" />
      <div className="pointer-events-none absolute -right-20 top-40 h-56 w-56 rounded-full bg-gradient-to-br from-sky-200/20 to-emerald-200/20 blur-3xl dark:from-sky-500/5 dark:to-emerald-500/5" />

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
        <div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-3 w-3 rounded-full bg-primary-500 shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
              <div className="absolute -inset-1 animate-ping rounded-full bg-primary-400/30" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Cuentas</h1>
          </div>
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            Gestiona tus cuentas financieras
          </p>
        </div>
        <Button onClick={() => navigate('/accounts/new')} className="self-start sm:self-auto">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Cuenta
        </Button>
      </div>

      {/* Summary Widget */}
      <div className="animate-fade-in" style={{ animationDelay: '0.05s', animationFillMode: 'both' }}>
        <AccountSummaryWidget />
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
                ? 'bg-gradient-to-r text-white shadow-md shadow-primary-500/20'
                : 'bg-white/70 text-gray-600 hover:bg-white hover:shadow-sm dark:bg-gray-800/70 dark:text-gray-400 dark:hover:bg-gray-800',
              activeType === filter.value && filter.color,
            )}
          >
            {activeType === filter.value && (
              <div className="absolute inset-0 bg-gradient-to-r opacity-100" style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }} />
            )}
            <span className="relative z-10">{filter.label}</span>
          </button>
        ))}
      </div>

      {/* Error State */}
      {isError && (
        <div className="animate-fade-in">
          <ErrorMessage
            message={(error as Error)?.message || 'Error al cargar las cuentas'}
            onRetry={() => window.location.reload()}
          />
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <AccountCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && data?.accounts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
          <div className="mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 p-5 dark:from-gray-800 dark:to-gray-700">
            <Banknote className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            No tienes cuentas aun
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-xs text-center">
            Crea tu primera cuenta para empezar a gestionar tus finanzas.
          </p>
          <Button onClick={() => navigate('/accounts/new')} size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Crear Cuenta
          </Button>
        </div>
      )}

      {/* Account Grid */}
      {!isLoading && !isError && data && data.accounts.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.accounts.map((account) => (
            <AccountCard account={account} index={0} />
          ))}
        </div>
      )}
    </div>
  )
}
