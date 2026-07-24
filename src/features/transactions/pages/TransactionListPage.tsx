import { useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Plus, ArrowLeftRight, RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui'
import { useTransactionInfinite } from '../hooks/useTransactions'
import TransactionCard from '../components/TransactionCard'
import TransactionTable from '../components/TransactionTable'
import TransactionFilters from '../components/TransactionFilters'
import TransactionSummaryWidget from '../components/TransactionSummaryWidget'
import InfiniteScrollContainer from '../components/InfiniteScrollContainer'
import EmptyTransactionState from '../components/EmptyTransactionState'
import type { TransactionFilters as TFilter } from '@/types/transactions'

export default function TransactionListPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const filters: TFilter = {
    transaction_type: searchParams.get('type') || undefined,
    status: searchParams.get('status') || undefined,
    category_id: searchParams.get('category_id') || undefined,
    account_id: searchParams.get('account_id') || undefined,
    search: searchParams.get('search') || undefined,
    date_from: searchParams.get('date_from') || undefined,
    date_to: searchParams.get('date_to') || undefined,
    min_amount: searchParams.get('min_amount') ? Number(searchParams.get('min_amount')) : undefined,
    max_amount: searchParams.get('max_amount') ? Number(searchParams.get('max_amount')) : undefined,
    source: searchParams.get('source') || undefined,
    sort_by: searchParams.get('sort_by') || 'effective_date',
    sort_order: searchParams.get('sort_order') || 'desc',
  }

  const {
    data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch,
  } = useTransactionInfinite(filters)

  const transactions = data?.pages.flatMap((p) => p.transactions) ?? []
  const totalCount = data?.pages[0]?.total ?? 0

  const updateFilters = useCallback((newFilters: TFilter) => {
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null && key !== 'page') {
        params.set(key, String(value))
      }
    })
    setSearchParams(params, { replace: true })
  }, [setSearchParams])

  const clearFilters = useCallback(() => {
    setSearchParams({}, { replace: true })
  }, [setSearchParams])

  const handleSort = useCallback((field: string) => {
    const currentSort = filters.sort_by === field
    updateFilters({
      ...filters,
      sort_by: field,
      sort_order: currentSort && filters.sort_order === 'asc' ? 'desc' : 'asc',
    })
  }, [filters, updateFilters])

  const activeFilterCount = Object.entries(filters).filter(([k, v]) =>
    k !== 'sort_by' && k !== 'sort_order' && v !== undefined && v !== '' && v !== null,
  ).length

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-emerald-200/20 dark:bg-emerald-500/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-red-200/20 dark:bg-red-500/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-primary-200/10 dark:bg-primary-500/5 blur-3xl" />
      </div>

      <div className="relative space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
              Transacciones
              <span className="inline-flex items-center justify-center h-6 px-2 rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 text-xs font-medium text-gray-500 dark:text-gray-400">
                {isLoading ? '...' : totalCount}
              </span>
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Gestiona todos tus movimientos financieros
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="rounded-xl"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
            <Button
              onClick={() => navigate('/transactions/new')}
              className="rounded-xl shadow-lg shadow-primary-500/20"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Transaccion
            </Button>
          </div>
        </div>

        <TransactionSummaryWidget />

        <TransactionFilters
          filters={filters}
          onChange={updateFilters}
          onClear={clearFilters}
        />

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-2xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 animate-pulse"
                style={{ animationDelay: `${i * 80}ms` }}
              />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-red-100 dark:bg-red-500/10 p-4 mb-4">
              <ArrowLeftRight className="h-8 w-8 text-red-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Error al cargar transacciones</p>
            <Button variant="outline" onClick={() => refetch()} className="rounded-xl">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          </div>
        ) : transactions.length === 0 ? (
          <EmptyTransactionState
            hasFilters={activeFilterCount > 0}
            onClearFilters={clearFilters}
            onCreateClick={() => navigate('/transactions/new')}
          />
        ) : (
          <InfiniteScrollContainer
            onLoadMore={fetchNextPage}
            hasMore={!!hasNextPage}
            isLoading={isFetchingNextPage}
          >
            <div className="hidden lg:block">
              <TransactionTable
                transactions={transactions}
                onSort={handleSort}
                sortBy={filters.sort_by}
                sortOrder={filters.sort_order}
              />
            </div>
            <div className="lg:hidden space-y-3">
              {transactions.map((tx, i) => (
                <div
                  key={tx.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <TransactionCard transaction={tx} />
                </div>
              ))}
            </div>
          </InfiniteScrollContainer>
        )}
      </div>
    </div>
  )
}
