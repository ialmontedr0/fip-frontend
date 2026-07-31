import { useNavigate } from 'react-router-dom'
import IncomeSourceForm from '../components/IncomeSourceForm'
import IncomeNav from '../components/IncomeNav'
import { useCreateSource } from '../hooks/useSources'
import { ArrowLeft, Building2 } from 'lucide-react'
import { Button } from '@/components/ui'
import type { CreateSourceRequest, UpdateSourceRequest } from '@/types/incomes'

export default function SourceCreatePage() {
  const navigate = useNavigate()
  const createMutation = useCreateSource()

  const handleSubmit = (data: CreateSourceRequest | UpdateSourceRequest) => {
    createMutation.mutate(data as CreateSourceRequest, {
      onSuccess: () => navigate('/incomes/sources'),
    })
  }

  return (
    <div className="space-y-6">
      <IncomeNav />

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700 p-6 text-white">
        <div className="relative flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/incomes/sources')}
            className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <Building2 className="h-6 w-6" />
            <div>
              <h1 className="text-2xl font-bold">Nueva Fuente de Ingreso</h1>
              <p className="text-purple-100 text-sm mt-1">Registra un empleador, cliente o negocio</p>
            </div>
          </div>
        </div>
      </div>

      <IncomeSourceForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/incomes/sources')}
        isSubmitting={createMutation.isPending}
        mode="create"
      />
    </div>
  )
}
