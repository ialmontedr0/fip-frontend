import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CircleDollarSign } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCreateLoan } from '../hooks/useLoans'
import LoanForm from '../components/LoanForm'

export default function LoanCreatePage() {
  const navigate = useNavigate()
  const createMutation = useCreateLoan()

  const handleSubmit = async (data: Parameters<typeof createMutation.mutateAsync>[0]) => {
    try {
      const result = await createMutation.mutateAsync(data)
      toast.success('Prestamo creado exitosamente')
      navigate(`/loans/${result.id}`)
    } catch (err: any) {
      toast.error(err?.message || 'Error al crear el prestamo')
    }
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
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
            <CircleDollarSign className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Nuevo Prestamo
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Registra un nuevo prestamo en tu cartera
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6">
          <LoanForm
            onSubmit={handleSubmit}
            isPending={createMutation.isPending}
            onCancel={() => navigate(-1)}
          />
        </div>
      </div>
    </div>
  )
}
