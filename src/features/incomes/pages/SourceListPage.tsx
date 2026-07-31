import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Skeleton, Modal } from '@/components/ui'
import { useSources, useDeleteSource, useCreateIncomeFromSource } from '../hooks/useSources'
import IncomeSourceCard from '../components/IncomeSourceCard'
import EmptyIncomeState from '../components/EmptyIncomeState'
import IncomeNav from '../components/IncomeNav'
import { ArrowLeft, Plus, Building2 } from 'lucide-react'
import type { SourceResponse } from '@/types/incomes'

export default function SourceListPage() {
  const navigate = useNavigate()
  const { data, isLoading, isError, refetch } = useSources()
  const deleteMutation = useDeleteSource()
  const createFromSource = useCreateIncomeFromSource()
  const [createModalSource, setCreateModalSource] = useState<SourceResponse | null>(null)

  const handleDelete = (source: SourceResponse) => {
    if (window.confirm(`Eliminar fuente: ${source.name}?`)) {
      deleteMutation.mutate(source.id)
    }
  }

  const handleCreateIncome = (source: SourceResponse) => {
    setCreateModalSource(source)
  }

  const confirmCreateIncome = () => {
    if (!createModalSource) return
    createFromSource.mutate(
      { sourceId: createModalSource.id, data: {} },
      {
        onSuccess: () => setCreateModalSource(null),
      },
    )
  }

  const sources = data?.sources || []

  return (
    <div className="space-y-6">
      <IncomeNav />

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700 p-6 text-white">
        <div className="relative flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate('/incomes')}
              className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Building2 className="h-6 w-6" />
            <div>
              <h1 className="text-2xl font-bold">Fuentes de Ingreso</h1>
              <p className="text-purple-100 text-sm mt-1">Gestiona tus empleadores, clientes y negocios</p>
            </div>
          </div>
          <Button onClick={() => navigate('/incomes/sources/new')} className="bg-white/20 hover:bg-white/30 text-white border-0 rounded-xl backdrop-blur-sm w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Fuente
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-red-500 mb-2">Error al cargar fuentes</p>
          <Button variant="outline" onClick={() => refetch()} className="rounded-xl">Reintentar</Button>
        </div>
      )}

      {!isLoading && !isError && sources.length === 0 && (
        <EmptyIncomeState type="sources" />
      )}

      {!isLoading && !isError && sources.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sources.map((source) => (
            <IncomeSourceCard
              key={source.id}
              source={source}
              onEdit={(s) => navigate(`/incomes/sources/${s.id}/edit`)}
              onDelete={handleDelete}
              onCreateIncome={handleCreateIncome}
            />
          ))}
        </div>
      )}

      <Modal isOpen={!!createModalSource} onClose={() => setCreateModalSource(null)} title="Crear Ingreso desde Fuente">
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Se creara un ingreso de <strong>{createModalSource?.name}</strong> por <strong>{createModalSource?.default_amount ? `$${createModalSource.default_amount}` : 'el monto default'}</strong> con fecha de hoy.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setCreateModalSource(null)} className="rounded-xl">Cancelar</Button>
            <Button onClick={confirmCreateIncome} disabled={createFromSource.isPending} className="rounded-xl">
              {createFromSource.isPending ? 'Creando...' : 'Confirmar'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
