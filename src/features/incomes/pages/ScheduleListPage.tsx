import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Skeleton } from '@/components/ui'
import { useSchedules, useDeleteSchedule, useReceiveScheduled, useProjectedIncome } from '../hooks/useSchedules'
import IncomeScheduleCard from '../components/IncomeScheduleCard'
import ReceiveScheduleModal from '../components/ReceiveScheduleModal'
import EmptyIncomeState from '../components/EmptyIncomeState'
import IncomeNav from '../components/IncomeNav'
import { ArrowLeft, Plus, CalendarDays } from 'lucide-react'
import type { ScheduleResponse, ReceiveScheduleRequest } from '@/types/incomes'

export default function ScheduleListPage() {
  const navigate = useNavigate()
  const { data, isLoading, isError, refetch } = useSchedules()
  const projectedQuery = useProjectedIncome()
  const deleteMutation = useDeleteSchedule()
  const receiveMutation = useReceiveScheduled()
  const [receiveModalOpen, setReceiveModalOpen] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleResponse | null>(null)

  const handleReceive = (schedule: ScheduleResponse) => {
    setSelectedSchedule(schedule)
    setReceiveModalOpen(true)
  }

  const handleConfirmReceive = (data: ReceiveScheduleRequest) => {
    if (!selectedSchedule) return
    receiveMutation.mutate(
      { scheduleId: selectedSchedule.id, data },
      {
        onSuccess: () => {
          setReceiveModalOpen(false)
          setSelectedSchedule(null)
        },
      },
    )
  }

  const handleDelete = (schedule: ScheduleResponse) => {
    if (window.confirm(`Eliminar programacion: ${schedule.description}?`)) {
      deleteMutation.mutate(schedule.id)
    }
  }

  const schedules = data?.schedules || []
  const projected = projectedQuery.data

  return (
    <div className="space-y-6">
      <IncomeNav />

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 p-6 text-white">
        <div className="relative flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate('/incomes')}
              className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <CalendarDays className="h-6 w-6" />
            <div>
              <h1 className="text-2xl font-bold">Programacion de Ingresos</h1>
              <p className="text-blue-100 text-sm mt-1">Planifica y proyecta tus ingresos futuros</p>
            </div>
          </div>
          <Button onClick={() => navigate('/incomes/schedule/new')} className="bg-white/20 hover:bg-white/30 text-white border-0 rounded-xl backdrop-blur-sm w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Programacion
          </Button>
        </div>
      </div>

      {projected && (
        <div className="rounded-2xl bg-gradient-to-r from-blue-500/10 to-emerald-500/10 backdrop-blur-xl border border-blue-200/50 dark:border-blue-800/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-gray-400 uppercase">Proyeccion Total ({projected.months} meses)</p>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(parseFloat(projected.total_projected))}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-medium text-gray-400 uppercase">Programaciones</p>
              <p className="text-lg font-bold text-blue-600">{projected.schedule_count}</p>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-red-500 mb-2">Error al cargar programaciones</p>
          <Button variant="outline" onClick={() => refetch()} className="rounded-xl">Reintentar</Button>
        </div>
      )}

      {!isLoading && !isError && schedules.length === 0 && (
        <EmptyIncomeState type="schedule" />
      )}

      {!isLoading && !isError && schedules.length > 0 && (
        <div className="space-y-3">
          {schedules.map((schedule) => (
            <IncomeScheduleCard
              key={schedule.id}
              schedule={schedule}
              onReceive={handleReceive}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <ReceiveScheduleModal
        isOpen={receiveModalOpen}
        onClose={() => { setReceiveModalOpen(false); setSelectedSchedule(null) }}
        schedule={selectedSchedule}
        onConfirm={handleConfirmReceive}
        isSubmitting={receiveMutation.isPending}
      />
    </div>
  )
}
