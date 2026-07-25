import { useMemo, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Button, Skeleton } from '@/components/ui'
import { useExpenses } from '../hooks/useExpenses'
import ExpenseCard from '../components/ExpenseCard'
import ExpenseTable from '../components/ExpenseTable'
import ExpenseFilters from '../components/ExpenseFilters'
import ExpenseNav from '../components/ExpenseNav'
import EmptyExpenseState from '../components/EmptyExpenseState'
import { cn } from '@/lib/utils'
import { Plus, TrendingDown, RefreshCw, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import type { ExpenseResponse, ExpenseFilters as ExpenseFiltersType } from '@/types/expenses'

export default function ExpenseListPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = useMemo(() => ({
    search: searchParams.get('search') || undefined,
    category_id: searchParams.get('category_id') || undefined,
    account_id: searchParams.get('account_id') || undefined,
    priority: searchParams.get('priority') || undefined,
    source: searchParams.get('source') || undefined,
    date_from: searchParams.get('date_from') || undefined,
    date_to: searchParams.get('date_to') || undefined,
    min_amount: searchParams.get('min_amount') ? Number(searchParams.get('min_amount')) : undefined,
    max_amount: searchParams.get('max_amount') ? Number(searchParams.get('max_amount')) : undefined,
    is_recurring: searchParams.has('is_recurring') ? searchParams.get('is_recurring') === 'true' : undefined,
    is_split: searchParams.has('is_split') ? searchParams.get('is_split') === 'true' : undefined,
    sort_by: searchParams.get('sort_by') || 'date',
    sort_order: searchParams.get('sort_order') || 'desc',
    page: Number(searchParams.get('page')) || 1,
    page_size: 20,
  } as ExpenseFiltersType), [searchParams])

  const { data, isLoading, isError, refetch, isFetching } = useExpenses(filters)

  const updateFilters = useCallback((newFilters: ExpenseFiltersType) => {
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null && key !== 'page_size') {
        params.set(key, String(value))
      }
    })
    setSearchParams(params, { replace: true })
  }, [setSearchParams])

  const expenses = data?.expenses || []
  const totalPages = data?.total_pages || 1
  const currentPage = data?.page || 1

  return (
    <div className="space-y-5 animate-fade-in">
      <ExpenseNav />

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 via-red-500 to-orange-600 p-6 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm">
              <TrendingDown className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Gastos</h1>
              <p className="text-rose-100/80 text-sm">Gestiona todos tus gastos</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="ghost"
              onClick={() => refetch()}
              disabled={isFetching}
              className="bg-white/10 hover:bg-white/20 text-white rounded-xl"
            >
              <RefreshCw className={cn('h-4 w-4 mr-1.5', isFetching && 'animate-spin')} />
              Actualizar
            </Button>
            <Button onClick={() => navigate('/expenses/new')} className="bg-white text-rose-700 hover:bg-white/90 border-0 rounded-xl shadow-lg shadow-black/10 flex-1 sm:flex-none">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Gasto
            </Button>
          </div>
        </div>
        {data && (
          <div className="relative mt-4 flex items-center gap-4 text-sm text-rose-100/70">
            <span>{data.total} gastos en total</span>
          </div>
        )}
      </div>

      <ExpenseFilters filters={filters} onChange={(newFilters) => updateFilters(newFilters as unknown as ExpenseFiltersType)} activeCount={0} />

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" style={{ animationDelay: `${i * 80}ms` }} />
          ))}
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-red-100 dark:bg-red-500/10 p-4 mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <p className="text-red-500 font-medium mb-1">Error al cargar gastos</p>
          <p className="text-sm text-gray-400 mb-4">No se pudieron obtener los datos. Intenta de nuevo.</p>
          <Button variant="outline" onClick={() => refetch()} className="rounded-xl">
            <RefreshCw className="h-4 w-4 mr-2" /> Reintentar
          </Button>
        </div>
      )}

      {!isLoading && !isError && expenses.length === 0 && <EmptyExpenseState variant="expenses" />}

      {!isLoading && !isError && expenses.length > 0 && (
        <>
          <div className="hidden md:block animate-fade-in">
            <ExpenseTable
              expenses={expenses}
              onSort={(field) => updateFilters({ ...filters, sort_by: field, sort_order: filters.sort_order === 'asc' ? 'desc' : 'asc' } as ExpenseFiltersType)}
              sortBy={filters.sort_by}
              sortOrder={filters.sort_order}
            />
          </div>
          <div className="md:hidden space-y-3">
            {expenses.map((expense: ExpenseResponse, i: number) => (
              <div key={expense.id} style={{ animationDelay: `${i * 50}ms` }} className="animate-fade-in">
                <ExpenseCard expense={expense} />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 py-2">
              <Button variant="outline" size="sm" onClick={() => updateFilters({ ...filters, page: currentPage - 1 })} disabled={currentPage <= 1} className="rounded-xl">
                <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
              </Button>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                  const pageNum = i + 1
                  return (
                    <button
                      key={pageNum}
                      onClick={() => updateFilters({ ...filters, page: pageNum })}
                      className={cn(
                        'w-8 h-8 rounded-lg text-sm font-medium transition-all',
                        pageNum === currentPage
                          ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
                          : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800',
                      )}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>
              <Button variant="outline" size="sm" onClick={() => updateFilters({ ...filters, page: currentPage + 1 })} disabled={currentPage >= totalPages} className="rounded-xl">
                Siguiente <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
