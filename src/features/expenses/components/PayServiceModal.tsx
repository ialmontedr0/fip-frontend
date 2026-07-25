import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, DollarSign, Calendar } from 'lucide-react'
import { Button, Input, Modal } from '@/components/ui'
import { cn, formatCurrency } from '@/lib/utils'
import type { ServiceResponse, MarkServicePaidRequest } from '@/types/expenses'

const schema = z.object({
  amount: z.string().optional().nullable(),
  paid_date: z.string().min(1, 'Fecha es requerida'),
})

type FormData = z.infer<typeof schema>

interface Props {
  service: ServiceResponse | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (id: string, data: MarkServicePaidRequest) => Promise<void>
  isSubmitting?: boolean
}

export default function PayServiceModal({ service, isOpen, onClose, onSubmit, isSubmitting }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { amount: service?.estimated_amount || '', paid_date: new Date().toISOString().split('T')[0] },
  })

  const submit = async (data: FormData) => {
    if (!service) return
    await onSubmit(service.id, {
      amount: data.amount || service.estimated_amount || null,
      paid_date: data.paid_date,
    })
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Pagar Servicio">
      {service && (
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{service.name}</p>
          {service.estimated_amount && (
            <p className="text-xs text-gray-400">Estimado: {formatCurrency(service.estimated_amount)}</p>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Monto</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input {...register('amount')} type="number" step="0.01" placeholder="0.00" className="rounded-xl pl-9" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Fecha de Pago <span className="text-red-400">*</span></label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input {...register('paid_date')} type="date" className={cn('rounded-xl pl-9', errors.paid_date && 'border-red-400')} />
            </div>
            {errors.paid_date && <p className="text-xs text-red-500">{errors.paid_date.message}</p>}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">Cancelar</Button>
            <Button type="submit" disabled={isSubmitting} className="rounded-xl">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirmar Pago'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}


