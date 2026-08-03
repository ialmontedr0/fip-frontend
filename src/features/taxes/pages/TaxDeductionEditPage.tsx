import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ReceiptText } from 'lucide-react'
import toast from 'react-hot-toast'
import { useTaxDeduction, useUpdateTaxDeduction, useTaxCategories } from '../hooks/useTaxes'
import DeductionForm from '../components/DeductionForm'

export default function TaxDeductionEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const currentYear = new Date().getFullYear()

  const { data: deduction, isLoading } = useTaxDeduction(id!)
  const { data: categoriesData } = useTaxCategories(currentYear)
  const updateMutation = useUpdateTaxDeduction()

  const categories = categoriesData?.categories || []

  const handleSubmit = async (data: Parameters<typeof updateMutation.mutateAsync>[0]['data']) => {
    try {
      await updateMutation.mutateAsync({ id: id!, data })
      toast.success('Deduccion actualizada')
      navigate('/taxes/deductions')
    } catch (err: any) {
      toast.error(err?.message || 'Error al actualizar la deduccion')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
      </div>
    )
  }

  if (!deduction) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <ReceiptText className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Deduccion no encontrada</h2>
        <button type="button" onClick={() => navigate('/taxes/deductions')} className="mt-4 text-sm text-violet-500 hover:underline">
          Volver a deducciones
        </button>
      </div>
    )
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
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20">
            <ReceiptText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Editar Deduccion</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{deduction.description}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6">
          <DeductionForm
            initialData={deduction}
            categories={categories}
            defaultYear={deduction.tax_year || currentYear}
            onSubmit={handleSubmit}
            isPending={updateMutation.isPending}
            onCancel={() => navigate(-1)}
          />
        </div>
      </div>
    </div>
  )
}
