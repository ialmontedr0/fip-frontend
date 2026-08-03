import { useNavigate } from 'react-router-dom'
import { ArrowLeft, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCreateAsset } from '../hooks/useInvestments'
import AssetForm from '../components/AssetForm'
import type { CreateAssetRequest } from '@/types/investment'

export default function AssetCreatePage() {
  const navigate = useNavigate()
  const createMutation = useCreateAsset()

  const handleSubmit = async (data: CreateAssetRequest) => {
    try {
      const result = await createMutation.mutateAsync(data)
      toast.success('Activo creado exitosamente')
      navigate(`/investments/assets/${result.id}`)
    } catch (err: any) {
      toast.error(err?.message || 'Error al crear el activo')
    }
  }

  return (
    <div className="relative space-y-6 pb-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-blue-500/5 blur-3xl dark:bg-blue-500/10" />
        <div className="absolute -right-40 top-60 h-80 w-80 rounded-full bg-indigo-500/5 blur-3xl dark:bg-indigo-500/10" />
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
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Nuevo Activo
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Registra una accion, bono, ETF, criptomoneda o fondo
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6">
          <AssetForm
            onSubmit={handleSubmit}
            isPending={createMutation.isPending}
            onCancel={() => navigate(-1)}
          />
        </div>
      </div>
    </div>
  )
}
