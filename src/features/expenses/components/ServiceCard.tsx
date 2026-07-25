import { useState } from 'react'
import { cn, formatCurrency } from '@/lib/utils'
import { SERVICE_ICON_MAP, SERVICE_TYPE_CONFIG, PAYMENT_STATUS_CONFIG } from '../constants'
import { Trash2, Edit3, CheckCircle } from 'lucide-react'
import { Button, Input, Modal } from '@/components/ui'
import type { ServiceResponse, MarkServicePaidRequest } from '@/types/expenses'

interface Props {
  service: ServiceResponse
  onEdit: (service: ServiceResponse) => void
  onDelete: (id: string) => void
  onPay: (id: string, data: MarkServicePaidRequest) => void
  className?: string
}

export default function ServiceCard({ service, onEdit, onDelete, onPay, className }: Props) {
  const [payOpen, setPayOpen] = useState(false)
  const [payAmount, setPayAmount] = useState(service.estimated_amount || '')
  const [payDate, setPayDate] = useState(new Date().toISOString().split('T')[0])
  const Icon = SERVICE_ICON_MAP[service.service_type] || SERVICE_ICON_MAP.other
  const typeConfig = SERVICE_TYPE_CONFIG[service.service_type]
  const statusConfig = PAYMENT_STATUS_CONFIG[service.payment_status as keyof typeof PAYMENT_STATUS_CONFIG] || PAYMENT_STATUS_CONFIG.pending

  const handlePay = () => {
    onPay(service.id, {
      amount: payAmount || null,
      paid_date: payDate,
    })
    setPayOpen(false)
  }

  return (
    <>
      <div className={cn(
        'rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl',
        'border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-xl',
        'transition-all duration-300 p-4 group',
        className,
      )}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${typeConfig.color}15` }}
            >
              <span style={{ color: typeConfig.color }}><Icon className="h-4 w-4" /></span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{service.name}</p>
              {service.provider && (
                <p className="text-[11px] text-gray-400">{service.provider}</p>
              )}
            </div>
          </div>
          <div className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', statusConfig.bgColor, statusConfig.color)}>
            {statusConfig.label}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
          {service.estimated_amount && (
            <div>
              <span className="text-gray-400">Estimado:</span>{' '}
              <span className="font-medium text-gray-700 dark:text-gray-300">{formatCurrency(service.estimated_amount)}</span>
            </div>
          )}
          {service.due_day && (
            <div>
              <span className="text-gray-400">Vence dia:</span>{' '}
              <span className="font-medium text-gray-700 dark:text-gray-300">{service.due_day}</span>
            </div>
          )}
          {service.last_paid_at && (
            <div>
              <span className="text-gray-400">Ultimo pago:</span>{' '}
              <span className="font-medium text-gray-700 dark:text-gray-300">{new Date(service.last_paid_at).toLocaleDateString('es-DO')}</span>
            </div>
          )}
          {service.account_number && (
            <div>
              <span className="text-gray-400">No. Cuenta:</span>{' '}
              <span className="font-medium text-gray-700 dark:text-gray-300">{service.account_number}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700/30">
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={() => setPayOpen(true)} className="rounded-lg h-7 text-[10px] gap-1">
              <CheckCircle className="h-3 w-3" />
              Pagar
            </Button>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => onEdit(service)} className="rounded-lg p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors">
              <Edit3 className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => onDelete(service.id)} className="rounded-lg p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      <Modal isOpen={payOpen} onClose={() => setPayOpen(false)} title="Pagar Servicio">
        <div className="space-y-4">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{service.name}</p>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Monto</label>
            <Input type="number" step="0.01" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Fecha de Pago</label>
            <Input type="date" value={payDate} onChange={(e) => setPayDate(e.target.value)} className="rounded-xl" />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setPayOpen(false)} className="rounded-xl">Cancelar</Button>
            <Button onClick={handlePay} className="rounded-xl">Confirmar Pago</Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
