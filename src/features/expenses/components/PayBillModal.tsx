import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, DollarSign } from 'lucide-react'
import { Button, Input, Modal } from '@/components/ui'
import { cn, formatCurrency } from '@/lib/utils'
import type { CardBillResponse, PayBillRequest } from '@/types/expenses'

  const schema = z.object({
    amount: z.string().min(1, 'Monto es requerido'),
    payment_method: z.string().optional(),
  })

  type FormData = z.infer<typeof schema>

  interface Props {
    bill: CardBillResponse | null
    isOpen: boolean
    onClose: () => void
    onSubmit: (billId: string, data: PayBillRequest) => Promise<void>
    isSubmitting?: boolean
  }

  export default function PayBillModal({ bill, isOpen, onClose, onSubmit, isSubmitting }: Props) {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
      resolver: zodResolver(schema),
      defaultValues: {
        amount: bill?.total_amount || '',
      },
    })

    const submit = async (data: FormData) => {
      if (!bill) return
      await onSubmit(bill.id, {
        amount: Number(data.amount),
      })
      onClose()
    }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Pagar Estado de Cuenta">
      {bill && (
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div className="rounded-xl bg-gray-50 dark:bg-gray-700/30 p-3 text-center">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Total a Pagar</p>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(bill.total_amount, 'DOP')}</p>
            {bill.minimum_payment && (
              <p className="text-xs text-gray-400 mt-1">
                Pago minimo: {formatCurrency(bill.minimum_payment, 'DOP')}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Monto a Pagar <span className="text-red-400">*</span></label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input {...register('amount')} type="number" step="0.01" placeholder="0.00" className={cn('rounded-xl pl-9', errors.amount && 'border-red-400')} />
            </div>
            {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Metodo de Pago</label>
            <Input {...register('payment_method')} placeholder="Ej: Transferencia" className={cn('rounded-xl', errors.payment_method && 'border-red-400')} />
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
