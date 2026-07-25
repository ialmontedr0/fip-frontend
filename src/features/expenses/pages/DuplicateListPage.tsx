import { useDuplicates } from '../hooks/useExpenses'
import DuplicateCard from '../components/DuplicateCard'
import ExpenseNav from '../components/ExpenseNav'
import EmptyExpenseState from '../components/EmptyExpenseState'
import { Button, Skeleton } from '@/components/ui'
import { Copy, AlertCircle } from 'lucide-react'
import type { DuplicatesResponse } from '@/types/expenses'

export default function DuplicateListPage() {
  const { data: duplicates, isLoading, isError, refetch } = useDuplicates()

  const handleKeepOne = (_keepId: string, _deleteIds: string[]) => {
    // TODO: implement keep one
  }

  const handleDeleteAll = (_ids: string[]) => {
    if (window.confirm(`Eliminar transacciones duplicadas?`)) {
      // TODO: implement delete all
    }
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <ExpenseNav />

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 p-6 text-white">
        <div className="relative flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm">
            <Copy className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Duplicados Detectados</h1>
            <p className="text-amber-100/80 text-sm">Revisa y elimina transacciones duplicadas</p>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-4">
          {[1, 2].map((i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
          <p className="text-red-500 font-medium">Error al detectar duplicados</p>
          <Button variant="outline" onClick={() => refetch()} className="rounded-xl mt-2">Reintentar</Button>
        </div>
      )}

      {!isLoading && !isError && (duplicates?.duplicates?.length || 0) === 0 && <EmptyExpenseState variant="duplicates" />}

      {!isLoading && !isError && duplicates && duplicates.duplicates.length > 0 && (
        <div className="space-y-4">
          {duplicates.duplicates.map((group: DuplicatesResponse['duplicates'][0], i: number) => (
            <DuplicateCard
              key={group.id || i}
              group={group}
              onKeepOne={handleKeepOne}
              onDeleteAll={handleDeleteAll}
            />
          ))}
        </div>
      )}
    </div>
  )
}
