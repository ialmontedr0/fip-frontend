import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Skeleton } from '@/components/ui'
import { useIrregularIncomes } from '../hooks/useIncomes'
import IrregularIncomeList from '../components/IrregularIncomeList'
import EmptyIncomeState from '../components/EmptyIncomeState'
import IncomeNav from '../components/IncomeNav'
import { ArrowLeft, AlertTriangle, RefreshCw } from 'lucide-react'

export default function IrregularDetectionPage() {
  const navigate = useNavigate()
  const [months, setMonths] = useState(6)
  const { data, isLoading, isError, refetch } = useIrregularIncomes(months)

  return (
    <div className="space-y-6">
      <IncomeNav />

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500 via-red-600 to-rose-700 p-6 text-white">
        <div className="relative flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate('/incomes')}
              className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <AlertTriangle className="h-6 w-6" />
            <div>
              <h1 className="text-2xl font-bold">Ingresos Irregulares</h1>
              <p className="text-red-100 text-sm mt-1">Identifica ingresos atipicos o fuera de lo comun</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="rounded-xl bg-white/20 text-white border-0 px-3 py-2 text-sm backdrop-blur-sm"
            >
              <option value={3} className="text-gray-900">3 meses</option>
              <option value={6} className="text-gray-900">6 meses</option>
              <option value={12} className="text-gray-900">12 meses</option>
            </select>
            <Button onClick={() => refetch()} className="bg-white/20 hover:bg-white/30 text-white border-0 rounded-xl backdrop-blur-sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-2xl" />
            ))}
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-red-500 mb-2">Error al identificar ingresos irregulares</p>
          <Button variant="outline" onClick={() => refetch()} className="rounded-xl">Reintentar</Button>
        </div>
      )}

      {!isLoading && !isError && data && (!data.irregularities || data.irregularities.length === 0) && (
        <EmptyIncomeState type="irregular" />
      )}

      {!isLoading && !isError && data?.irregularities && data.irregularities.length > 0 && (
        <IrregularIncomeList data={data} />
      )}
    </div>
  )
}
