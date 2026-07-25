import { useState, useMemo, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Button, Skeleton } from '@/components/ui'
import { useIncomes, useBatchUpdateStatus, useDeleteIncome } from '../hooks/useIncomes'
import IncomeCard from '../components/IncomeCard'
import IncomeTable from '../components/IncomeTable'
import IncomeFilters from '../components/IncomeFilters'
import IncomeNav from '../components/IncomeNav'
import EmptyIncomeState from '../components/EmptyIncomeState'
import BatchStatusModal from '../components/BatchStatusModal'
import { Plus, ChevronLeft, ChevronRight, TrendingUp, RefreshCw, AlertCircle } from 'lucide-react'
import type { IncomesFilters, IncomeResponse } from '@/types/incomes'

export default function IncomeListPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [batchModalOpen, setBatchModalOpen] = useState(false)

  const filters = useMemo(() => ({
    income_type: searchParams.get('income_type') || undefined,
    income_status: searchParams.get('income_status') || undefined,
    stability: searchParams.get('stability') || undefined,
    income_source_id: searchParams.get('income_source_id') || undefined,
    category_id: searchParams.get('category_id') || undefined,
    account_id: searchParams.get('account_id') || undefined,
    min_amount: searchParams.get('min_amount') ? Number(searchParams.get('min_amount')) : undefined,
    max_amount: searchParams.get('max_amount') ? Number(searchParams.get('max_amount')) : undefined,
    date_from: searchParams.get('date_from') || undefined,
    date_to: searchParams.get('date_to') || undefined,
    search: searchParams.get('search') || undefined,
    sort_by: searchParams.get('sort_by') || 'effective_date',
    sort_order: searchParams.get('sort_order') || 'desc',
    page: Number(searchParams.get('page')) || 1,
    page_size: 20,
  } as IncomesFilters), [searchParams])

  const { data, isLoading, isError, refetch, isFetching } = useIncomes(filters)
  const batchMutation = useBatchUpdateStatus()
  const deleteMutation = useDeleteIncome()

  const updateFilters = useCallback((newFilters: IncomesFilters) => {
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null && key !== 'page_size') {
        params.set(key, String(value))
      }
    })
    setSearchParams(params, { replace: true })
  }, [setSearchParams])

  const clearFilters = useCallback(() => {
    setSearchParams({}, { replace: true })
  }, [setSearchParams])

  const incomes = data?.incomes || []
  const totalPages = data?.total_pages || 1
  const currentPage = data?.page || 1

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === incomes.length) setSelectedIds(new Set())
    else setSelectedIds(new Set(incomes.map((i) => i.id)))
  }

  const handleBatchUpdate = (status: string) => {
    batchMutation.mutate(
      { income_ids: Array.from(selectedIds), status },
      { onSuccess: () => { setBatchModalOpen(false); setSelectedIds(new Set()) } },
    )
  }

  const handleDelete = (income: IncomeResponse) => {
    if (window.confirm(`Eliminar ingreso: ${income.description}?`)) deleteMutation.mutate(income.id)
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <IncomeNav />

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-6 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Ingresos</h1>
              <p className="text-emerald-100/80 text-sm">Gestiona todos tus ingresos</p>
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
            <Button onClick={() => navigate('/incomes/new')} className="bg-white text-emerald-700 hover:bg-white/90 border-0 rounded-xl shadow-lg shadow-black/10 flex-1 sm:flex-none">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Ingreso
            </Button>
          </div>
        </div>
        {data && (
          <div className="relative mt-4 flex items-center gap-4 text-sm text-emerald-100/70">
            <span>{data.total} ingresos en total</span>
          </div>
        )}
      </div>

      <IncomeFilters filters={filters} onChange={updateFilters} onClear={clearFilters} />

      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary-50 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/30 animate-fade-in">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
              {selectedIds.size} seleccionado{selectedIds.size !== 1 ? 's' : ''}
            </span>
          </div>
          <Button variant="default" size="sm" onClick={() => setBatchModalOpen(true)} className="rounded-xl ml-auto">
            Actualizar Estado
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setSelectedIds(new Set())} className="rounded-xl">
            Limpiar
          </Button>
        </div>
      )}

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
          <p className="text-red-500 font-medium mb-1">Error al cargar ingresos</p>
          <p className="text-sm text-gray-400 mb-4">No se pudieron obtener los datos. Intenta de nuevo.</p>
          <Button variant="outline" onClick={() => refetch()} className="rounded-xl">
            <RefreshCw className="h-4 w-4 mr-2" /> Reintentar
          </Button>
        </div>
      )}

      {!isLoading && !isError && incomes.length === 0 && <EmptyIncomeState type="incomes" />}

      {!isLoading && !isError && incomes.length > 0 && (
        <>
          <div className="hidden md:block animate-fade-in">
            <IncomeTable
              incomes={incomes}
              selectedIds={selectedIds}
              onSelect={toggleSelect}
              onSelectAll={toggleSelectAll}
              onEdit={(income) => navigate(`/incomes/${income.id}/edit`)}
              onDelete={handleDelete}
            />
          </div>
          <div className="md:hidden space-y-3">
            {incomes.map((income, i) => (
              <div key={income.id} style={{ animationDelay: `${i * 50}ms` }} className="animate-fade-in">
                <IncomeCard
                  income={income}
                  selected={selectedIds.has(income.id)}
                  onSelect={toggleSelect}
                />
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

      <BatchStatusModal
        isOpen={batchModalOpen}
        onClose={() => setBatchModalOpen(false)}
        selectedCount={selectedIds.size}
        onConfirm={handleBatchUpdate}
        isSubmitting={batchMutation.isPending}
      />
    </div>
  )
}

function cn(...inputs: (string | boolean | undefined | null | { [key: string]: boolean | undefined | null })[]) {
  return inputs.filter(Boolean).join(' ')
}
