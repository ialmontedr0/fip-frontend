import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CircleDollarSign } from 'lucide-react'
import toast from 'react-hot-toast'
import { useLoan, useUpdateLoan } from '../hooks/useLoans'
import type { UpdateLoanRequest } from '@/types/loans'
import LoanForm from '../components/LoanForm'

export default function LoanEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: loan, isLoading } = useLoan(id!)
  const updateMutation = useUpdateLoan()

  const handleSubmit = async (data: UpdateLoanRequest) => {
    try {
      await updateMutation.mutateAsync({ id: id!, data })
      toast.success('Prestamo actualizado exitosamente')
      navigate(`/loans/${id}`)
    } catch (err: any) {
      toast.error(err?.message || 'Error al actualizar el prestamo')
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

  if (!loan) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <CircleDollarSign className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Prestamo no encontrado</h2>
        <button type="button" onClick={() => navigate('/loans')} className="mt-4 text-sm text-emerald-500 hover:underline">
          Volver a prestamos
        </button>
      </div>
    )
  }

  return (
    <div className="relative space-y-6 pb-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-emerald-500/5 blur-3xl dark:bg-emerald-500/10" />
        <div className="absolute -right-40 top-60 h-80 w-80 rounded-full bg-teal-500/5 blur-3xl dark:bg-teal-500/10" />
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => navigate(`/loans/${id}`)}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Detalle
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
            <CircleDollarSign className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Editar Prestamo
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {loan.name}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6">
          <LoanForm
            initialData={loan}
            onSubmit={handleSubmit}
            isPending={updateMutation.isPending}
            onCancel={() => navigate(`/loans/${id}`)}
          />
        </div>
      </div>
    </div>
  )
}
