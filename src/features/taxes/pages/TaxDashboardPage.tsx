import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ReceiptText, Tags, Plus, ChevronRight, ArrowRight, Search } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useTaxSummary, useTaxCategories, useTaxDeductions } from '../hooks/useTaxes'
import TaxSummaryCards from '../components/TaxSummaryCards'
import CategoryBadge from '../components/CategoryBadge'
import { taxCategoryColor } from '@/types/taxes'

export default function TaxDashboardPage() {
  const navigate = useNavigate()
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)

  const years = useMemo(() => {
    const list: number[] = []
    for (let y = currentYear; y >= currentYear - 4; y--) list.push(y)
    return list
  }, [currentYear])

  const { data: summary, isLoading: summaryLoading } = useTaxSummary(selectedYear)
  const { data: categoriesData } = useTaxCategories(selectedYear)
  const { data: deductionsData } = useTaxDeductions({ tax_year: selectedYear })

  const categories = categoriesData?.categories || []
  const deductions = deductionsData?.deductions || []

  return (
    <div className="relative space-y-6 pb-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-violet-500/5 blur-3xl dark:bg-violet-500/10" />
        <div className="absolute -right-40 top-60 h-80 w-80 rounded-full bg-purple-500/5 blur-3xl dark:bg-purple-500/10" />
      </div>

      <div className="relative animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20">
              <ReceiptText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Impuestos</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Gestiona tus deducciones fiscales</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            >
              {years.map((year) => (
                <option key={year} value={year}>Año {year}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => navigate('/taxes/deductions/new')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25 transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              Nueva Deduccion
            </button>
          </div>
        </div>
      </div>

      <div className="relative animate-fade-in" style={{ animationDelay: '0.05s', animationFillMode: 'both' }}>
        <TaxSummaryCards summary={summary} loading={summaryLoading} />
      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
        <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Tags className="h-4 w-4 text-violet-500" />
              Categorias ({categories.length})
            </h3>
            <button
              type="button"
              onClick={() => navigate('/taxes/categories')}
              className="inline-flex items-center gap-1 text-xs font-medium text-violet-600 dark:text-violet-400 hover:underline"
            >
              Ver todas
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          {categories.length > 0 ? (
            <div className="space-y-2.5">
              {categories.slice(0, 5).map((cat) => {
                const color = taxCategoryColor(cat.name)
                return (
                  <div key={cat.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{cat.name}</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0 ml-2">
                      {cat.deduction_count} deduccion{cat.deduction_count !== 1 ? 'es' : ''}
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6">
              No hay categorias para {selectedYear}
            </p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <ReceiptText className="h-4 w-4 text-violet-500" />
              Ultimas Deducciones
            </h3>
            <button
              type="button"
              onClick={() => navigate('/taxes/deductions')}
              className="inline-flex items-center gap-1 text-xs font-medium text-violet-600 dark:text-violet-400 hover:underline"
            >
              Ver todas
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          {deductions.length > 0 ? (
            <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {deductions.slice(0, 5).map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => navigate(`/taxes/deductions/${d.id}/edit`)}
                  className="w-full flex items-center justify-between gap-3 py-3 text-left first:pt-0 last:pb-0 hover:opacity-80 transition-opacity"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{d.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-2">
                      {formatDate(d.date, 'long')}
                      <CategoryBadge name={d.category_name} />
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(d.amount)}
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-300 dark:text-gray-600" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Search className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                No hay deducciones para {selectedYear}
              </p>
              <button
                type="button"
                onClick={() => navigate('/taxes/deductions/new')}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25 transition-all duration-200"
              >
                <Plus className="h-3.5 w-3.5" />
                Agregar deduccion
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
