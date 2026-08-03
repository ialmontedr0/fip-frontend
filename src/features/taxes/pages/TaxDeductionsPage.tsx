import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ReceiptText, Plus, Search, Pencil } from 'lucide-react'
import toast from 'react-hot-toast'
import { useTaxDeductions, useDeleteTaxDeduction, useTaxCategories } from '../hooks/useTaxes'
import DeductionCard from '../components/DeductionCard'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import type { TaxDeduction } from '@/types/taxes'

export default function TaxDeductionsPage() {
  const navigate = useNavigate()
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [categoryFilter, setCategoryFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [toDelete, setToDelete] = useState<TaxDeduction | null>(null)

  const { data, isLoading } = useTaxDeductions({
    tax_year: selectedYear,
    category_id: categoryFilter || undefined,
  })
  const { data: categoriesData } = useTaxCategories(selectedYear)
  const deleteMutation = useDeleteTaxDeduction()

  const categories = categoriesData?.categories || []
  const deductions = data?.deductions || []

  const filtered = searchQuery.trim()
    ? deductions.filter((d) => d.description.toLowerCase().includes(searchQuery.toLowerCase()))
    : deductions

  const handleDelete = async () => {
    if (!toDelete) return
    try {
      await deleteMutation.mutateAsync(toDelete.id)
      toast.success('Deduccion eliminada')
      setToDelete(null)
    } catch (err: any) {
      toast.error(err?.message || 'Error al eliminar la deduccion')
      setToDelete(null)
    }
  }

  return (
    <div className="relative space-y-6 pb-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-violet-500/5 blur-3xl dark:bg-violet-500/10" />
        <div className="absolute -right-40 top-60 h-80 w-80 rounded-full bg-purple-500/5 blur-3xl dark:bg-purple-500/10" />
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => navigate('/taxes')}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Impuestos
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20">
              <ReceiptText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Deducciones Fiscales</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {deductions.length > 0 ? `${deductions.length} deduccion${deductions.length !== 1 ? 'es' : ''}` : 'Registra tus gastos deducibles'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/taxes/deductions/new')}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25 transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            Nueva Deduccion
          </button>
        </div>

        <div className="relative flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar deducciones..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all"
            />
          </div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30"
          >
            {[currentYear, currentYear - 1, currentYear - 2, currentYear - 3, currentYear - 4].map((year) => (
              <option key={year} value={year}>Año {year}</option>
            ))}
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30"
          >
            <option value="">Todas las categorias</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="relative animate-fade-in">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 animate-pulse">
                  <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
                  <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((d, idx) => (
                <DeductionCard
                  key={d.id}
                  deduction={d}
                  index={idx}
                  onEdit={() => navigate(`/taxes/deductions/${d.id}/edit`)}
                  onDelete={() => setToDelete(d)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
              <Pencil className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {searchQuery ? `Sin resultados para "${searchQuery}"` : 'No hay deducciones para este año'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
                {searchQuery ? 'Intenta con otros terminos de busqueda' : 'Agrega tu primera deduccion fiscal'}
              </p>
              {!searchQuery && (
                <button
                  type="button"
                  onClick={() => navigate('/taxes/deductions/new')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25 transition-all duration-200"
                >
                  <Plus className="h-4 w-4" />
                  Nueva Deduccion
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        title="Eliminar deduccion"
        message={`¿Seguro que deseas eliminar la deduccion "${toDelete?.description}"?`}
        confirmLabel="Eliminar"
        destructive
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
