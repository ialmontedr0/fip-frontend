import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CreditCard, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { useInsurance, useCreateInsurancePremium } from '../hooks/useInsurance'
import PremiumForm from '../components/PremiumForm'
import type { CreateInsurancePremiumRequest } from '@/types/insurance'
import { formatCurrency } from '@/lib/utils'

export default function InsurancePremiumCreatePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: insurance, isLoading } = useInsurance(id!)
  const createPremiumMutation = useCreateInsurancePremium(id!)

  const handleSubmit = async (data: CreateInsurancePremiumRequest) => {
    try {
      await createPremiumMutation.mutateAsync(data)
      toast.success('Prima creada exitosamente')
      navigate(`/insurance/${id}?tab=premiums`)
    } catch (err: any) {
      toast.error(err?.message || 'Error al crear la prima')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!insurance) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <ShieldCheck className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Seguro no encontrado</h2>
        <button type="button" onClick={() => navigate('/insurance')} className="mt-4 text-sm text-emerald-500 hover:underline">
          Volver a seguros
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
          onClick={() => navigate(`/insurance/${id}`)}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors mb-4 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Volver a Detalle
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Nueva Prima
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{insurance.name}</p>
          </div>
        </div>
      </div>

      <div className="relative animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6">
            <PremiumForm
              defaultAmount={insurance.premium_amount}
              onSubmit={handleSubmit}
              isPending={createPremiumMutation.isPending}
              onCancel={() => navigate(`/insurance/${id}`)}
            />
          </div>

          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-emerald-500" />
                Resumen
              </h3>
              <div className="space-y-2.5 divide-y divide-gray-100 dark:divide-gray-700/50">
                <div className="flex items-center justify-between text-sm pt-0">
                  <span className="text-gray-500 dark:text-gray-400">Prima sugerida</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(insurance.premium_amount)}</span>
                </div>
                <div className="flex items-center justify-between text-sm pt-2.5">
                  <span className="text-gray-500 dark:text-gray-400">Frecuencia</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">{insurance.premium_frequency.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center justify-between text-sm pt-2.5">
                  <span className="text-gray-500 dark:text-gray-400">Cobertura</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    {insurance.coverage_amount ? formatCurrency(insurance.coverage_amount) : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
