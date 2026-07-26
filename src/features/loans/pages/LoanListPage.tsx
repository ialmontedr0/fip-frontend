import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus, Calculator, Search, SlidersHorizontal,
  CircleDollarSign,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLoanList, useLoanSummary } from '../hooks/useLoans'
import LoanSummaryCards from '../components/LoanSummaryCards'
import LoanCard from '../components/LoanCard'
import { LOAN_STATUSES, LOAN_TYPES } from '@/types/loans'

export default function LoanListPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const { data, isLoading } = useLoanList({
    status: statusFilter || undefined,
    loan_type: typeFilter || undefined,
  })
  const { data: summary } = useLoanSummary()

  const loans = data?.loans || []

  const filtered = useMemo(() => {
    let result = loans
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter((l) => l.name.toLowerCase().includes(q))
    }
    return result
  }, [loans, searchQuery])

  const totalCount = data?.total ?? 0

  return (
    <div className="relative space-y-6 pb-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-emerald-500/5 blur-3xl dark:bg-emerald-500/10" />
        <div className="absolute -right-40 top-60 h-80 w-80 rounded-full bg-teal-500/5 blur-3xl dark:bg-teal-500/10" />
      </div>

      {summary && !isLoading && (
        <div className="relative animate-fade-in">
          <LoanSummaryCards summary={summary} />
        </div>
      )}

      <div className="relative animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
              <CircleDollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Prestamos</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {totalCount > 0 ? `${totalCount} prestamo${totalCount !== 1 ? 's' : ''}` : 'Gestiona tus prestamos'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/loans/simulator')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Calculator className="h-4 w-4" />
              Simulador
            </button>
            <button
              type="button"
              onClick={() => navigate('/loans/new')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              Nuevo Prestamo
            </button>
          </div>
        </div>
      </div>

      <div className="relative animate-fade-in" style={{ animationDelay: '0.05s', animationFillMode: 'both' }}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar prestamos..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'inline-flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all',
                showFilters
                  ? 'border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50',
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtros
            </button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          'relative overflow-hidden transition-all duration-300',
          showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="p-4 bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Estado</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              >
                <option value="">Todos los estados</option>
                {Object.entries(LOAN_STATUSES).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Tipo</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              >
                <option value="">Todos los tipos</option>
                {Object.entries(LOAN_TYPES).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="relative animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-gray-200 dark:bg-gray-700" />
                  <div className="flex-1">
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded mt-1" />
                  </div>
                </div>
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                <div className="flex gap-2 mt-3">
                  <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <div className="h-5 w-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <>
            {searchQuery && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                {filtered.length} resultado{filtered.length !== 1 ? 's' : ''} para &quot;{searchQuery}&quot;
              </p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((loan, idx) => (
                <div
                  key={loan.id}
                  onClick={() => navigate(`/loans/${loan.id}`)}
                  className="cursor-pointer"
                  style={{ animationDelay: `${idx * 0.05}s`, animationFillMode: 'both' }}
                >
                  <LoanCard loan={loan} index={idx} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
            <CircleDollarSign className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {searchQuery ? `Sin resultados para "${searchQuery}"` : 'No tienes prestamos aun'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
              {searchQuery ? 'Intenta con otros terminos de busqueda' : 'Agrega tu primer prestamo para empezar a dar seguimiento'}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate('/loans/new')}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25 transition-all duration-200"
              >
                <Plus className="h-4 w-4" />
                Nuevo Prestamo
              </button>
              <button
                type="button"
                onClick={() => navigate('/loans/simulator')}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Calculator className="h-4 w-4" />
                Simulador
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
