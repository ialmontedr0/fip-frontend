import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Tags, Plus, Trash2, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'
import { useTaxCategories, useCreateTaxCategory, useDeleteTaxCategory } from '../hooks/useTaxes'
import CategoryForm from '../components/CategoryForm'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { taxCategoryColor } from '@/types/taxes'
import type { TaxCategory } from '@/types/taxes'

export default function TaxCategoriesPage() {
  const navigate = useNavigate()
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [showCreate, setShowCreate] = useState(false)
  const [toDelete, setToDelete] = useState<TaxCategory | null>(null)

  const { data, isLoading } = useTaxCategories(selectedYear)
  const createMutation = useCreateTaxCategory()
  const deleteMutation = useDeleteTaxCategory()

  const categories = data?.categories || []

  const handleCreate = async (payload: Parameters<typeof createMutation.mutateAsync>[0]) => {
    try {
      await createMutation.mutateAsync(payload)
      toast.success('Categoria creada exitosamente')
      setShowCreate(false)
    } catch (err: any) {
      toast.error(err?.message || 'Error al crear la categoria')
    }
  }

  const handleDelete = async () => {
    if (!toDelete) return
    try {
      await deleteMutation.mutateAsync(toDelete.id)
      toast.success('Categoria eliminada')
      setToDelete(null)
    } catch (err: any) {
      toast.error(err?.message || 'Error al eliminar la categoria')
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
              <Tags className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Categorias Fiscales</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {categories.length > 0 ? `${categories.length} categoria${categories.length !== 1 ? 's' : ''}` : 'Organiza tus deducciones'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            >
              {[currentYear, currentYear - 1, currentYear - 2, currentYear - 3, currentYear - 4].map((year) => (
                <option key={year} value={year}>Año {year}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25 transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              Nueva Categoria
            </button>
          </div>
        </div>

        <div className="relative animate-fade-in">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 animate-pulse">
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
                  <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat, idx) => {
                const color = taxCategoryColor(cat.name)
                return (
                  <div
                    key={cat.id}
                    className="group relative bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 shadow-sm hover:shadow-md transition-all duration-300"
                    style={{ animationDelay: `${idx * 60}ms`, animationFillMode: 'both' }}
                  >
                    <div
                      className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                      style={{ backgroundColor: color }}
                    />
                    <div className="relative pt-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 truncate">{cat.name}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {cat.tax_year}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setToDelete(cat)}
                          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      {cat.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">{cat.description}</p>
                      )}
                      <div className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-violet-50 dark:bg-violet-500/10 px-2.5 py-1 text-xs font-medium text-violet-600 dark:text-violet-400">
                        {cat.deduction_count} deduccion{cat.deduction_count !== 1 ? 'es' : ''}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
              <Tags className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No tienes categorias aun</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
                Crea categorias para organizar mejor tus deducciones fiscales
              </p>
              <button
                type="button"
                onClick={() => setShowCreate(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25 transition-all duration-200"
              >
                <Plus className="h-4 w-4" />
                Nueva Categoria
              </button>
            </div>
          )}
        </div>
      </div>

      <CategoryForm
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
        defaultYear={selectedYear}
        isPending={createMutation.isPending}
      />

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        title="Eliminar categoria"
        message={`¿Seguro que deseas eliminar la categoria "${toDelete?.name}"? Las deducciones asociadas quedaran sin categoria.`}
        confirmLabel="Eliminar"
        destructive
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
