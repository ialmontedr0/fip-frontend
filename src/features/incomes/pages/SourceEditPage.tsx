import { useParams, useNavigate } from 'react-router-dom'
import { Button, Skeleton } from '@/components/ui'
import { useSource, useUpdateSource } from '../hooks/useSources'
import IncomeSourceForm from '../components/IncomeSourceForm'
import { ArrowLeft } from 'lucide-react'
import type { UpdateSourceRequest } from '@/types/incomes'

export default function SourceEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: source, isLoading, isError, refetch } = useSource(id)
  const updateMutation = useUpdateSource()

  const handleSubmit = (data: UpdateSourceRequest) => {
    if (!id) return
    updateMutation.mutate(
      { id, data },
      { onSuccess: () => navigate('/incomes/sources') },
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    )
  }

  if (isError || !source) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-red-500 mb-2">Error al cargar la fuente</p>
        <Button variant="outline" onClick={() => refetch()} className="rounded-xl">Reintentar</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700 p-6 text-white">
        <div className="relative flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/incomes/sources')}
            className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Editar Fuente</h1>
            <p className="text-purple-100 text-sm mt-1">{source.name}</p>
          </div>
        </div>
      </div>

      <IncomeSourceForm
        defaultValues={{
          name: source.name,
          income_type: source.income_type,
          stability: source.stability,
          description: source.description || undefined,
          tax_id: source.tax_id || undefined,
          default_amount: source.default_amount || undefined,
          default_account_id: source.default_account_id || undefined,
          default_category_id: source.default_category_id || undefined,
          frequency: source.frequency || undefined,
          pay_day: source.pay_day || undefined,
          icon: source.icon || undefined,
          color: source.color || undefined,
        }}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/incomes/sources')}
        isSubmitting={updateMutation.isPending}
        mode="edit"
      />
    </div>
  )
}
