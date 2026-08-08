import { useState } from 'react'
import {
  useServices,
  useUpcomingServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
  useMarkServicePaid,
} from '../hooks/useServices'
import ServiceCard from '../components/ServiceCard'
import ServiceForm from '../components/ServiceForm'
import PayServiceModal from '../components/PayServiceModal'
import ExpenseNav from '../components/ExpenseNav'
import EmptyExpenseState from '../components/EmptyExpenseState'
import { Button, Skeleton, Modal } from '@/components/ui'
import { Wrench, AlertCircle, Plus, CalendarClock } from 'lucide-react'
import type { CreateServiceRequest, ServiceResponse, MarkServicePaidRequest } from '@/types/expenses'
import useConfirm from '@/hooks/useConfirm'

export default function ServiceListPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [editingService, setEditingService] = useState<ServiceResponse | null>(null)
  const [payingService, setPayingService] = useState<ServiceResponse | null>(null)
  const { confirm, confirmDialog } = useConfirm()

  const { data: services, isLoading, isError, refetch } = useServices()
  const { data: upcoming } = useUpcomingServices() as { data: { services: ServiceResponse[] } | undefined }
  const createMutation = useCreateService()
  const updateMutation = useUpdateService()
  const deleteMutation = useDeleteService()
  const payMutation = useMarkServicePaid()

  const handleCreate = async (data: CreateServiceRequest) => {
    createMutation.mutate(data, { onSuccess: () => setFormOpen(false) })
  }

  const handleUpdate = async (data: CreateServiceRequest) => {
    if (!editingService) return
    updateMutation.mutate({ id: editingService.id, data }, { onSuccess: () => setEditingService(null) })
  }

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: 'Eliminar servicio',
      message: 'Eliminar este servicio?',
      confirmLabel: 'Eliminar',
      destructive: true,
    })
    if (ok) deleteMutation.mutate(id)
  }

  const handlePay = async (id: string, data: MarkServicePaidRequest) => {
    payMutation.mutate({ id, data }, { onSuccess: () => setPayingService(null) })
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <ExpenseNav />

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500 via-emerald-500 to-green-600 p-6 text-white">
        <div className="relative flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm">
              <Wrench className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Servicios</h1>
              <p className="text-teal-100/80 text-sm">Gestiona tus servicios mensuales</p>
            </div>
          </div>
          <Button onClick={() => setFormOpen(true)} className="bg-white text-teal-700 hover:bg-white/90 border-0 rounded-xl shadow-lg shadow-black/10 w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" /> Nuevo Servicio
          </Button>
        </div>
        {services && (
          <div className="relative mt-4 flex items-center gap-4 text-sm text-teal-100/70">
            <span>{services.services.length} servicios</span>
            {upcoming && upcoming.services.length > 0 && (
              <span className="flex items-center gap-1">
                <CalendarClock className="h-3.5 w-3.5" />
                {upcoming.services.length} proximos a vencer
              </span>
            )}
          </div>
        )}
      </div>

      {upcoming && upcoming.services.length > 0 && (
        <div className="rounded-2xl bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-700/30 p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-3">Proximos a Vencer</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {upcoming.services.slice(0, 6).map((service) => (
              <div key={service.id} className="flex items-center justify-between rounded-xl bg-white/60 dark:bg-gray-800/60 p-3">
                <div>
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{service.name}</p>
                  <p className="text-[10px] text-gray-400">Vence dia {service.due_day}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => setPayingService(service)} className="rounded-lg h-7 text-[10px]">
                  Pagar
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
          <p className="text-red-500 font-medium">Error al cargar servicios</p>
          <Button variant="outline" onClick={() => refetch()} className="rounded-xl mt-2">Reintentar</Button>
        </div>
      )}

      {!isLoading && !isError && services?.services?.length === 0 && <EmptyExpenseState variant="services" />}

      {!isLoading && !isError && services && services.services.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onEdit={setEditingService}
              onDelete={handleDelete}
              onPay={handlePay}
            />
          ))}
        </div>
      )}

      <Modal isOpen={formOpen || !!editingService} onClose={() => { setFormOpen(false); setEditingService(null) }} title={editingService ? 'Editar Servicio' : 'Nuevo Servicio'}>
        <ServiceForm
          onSubmit={editingService ? handleUpdate : handleCreate}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          initialData={editingService || undefined}
        />
      </Modal>

      <PayServiceModal
        service={payingService}
        isOpen={!!payingService}
        onClose={() => setPayingService(null)}
        onSubmit={handlePay}
        isSubmitting={payMutation.isPending}
      />
      {confirmDialog}
    </div>
  )
}
