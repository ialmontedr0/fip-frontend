import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, ShoppingCart, Store, DollarSign, Percent, Calendar,
  PiggyBank, TrendingUp, Info, FileText, Calculator,
  CreditCard, Trash2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/utils'
import { useCreditPurchase, useDeleteCreditPurchase } from '../hooks/useCreditPurchases'
import StatusBadge from '../components/StatusBadge'
import InstallmentTable from '../components/InstallmentTable'
import { FREQUENCY_LABELS } from '../constants'
import toast from 'react-hot-toast'

function StatCard({ icon: Icon, label, value, color, sub }: { icon: React.ElementType; label: string; value: React.ReactNode; color?: string; sub?: string }) {
  return (
    <div className="bg-white dark:bg-gray-800/80 rounded-xl border border-gray-100 dark:border-gray-700/50 p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      <div className="flex items-center gap-2 mb-1.5">
        <Icon className={cn('h-4 w-4', color || 'text-gray-400')} />
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      </div>
      <p className={cn('text-lg font-bold', color || 'text-gray-900 dark:text-gray-100')}>{value}</p>
      {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}

export default function CreditPurchaseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: purchase, isLoading } = useCreditPurchase(id!)
  const deletePurchase = useDeleteCreditPurchase()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!purchase) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <ShoppingCart className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Compra no encontrada</h2>
        <button type="button" onClick={() => navigate('/credit-purchases')} className="mt-4 text-sm text-emerald-500 hover:underline">
          Volver a compras a credito
        </button>
      </div>
    )
  }

  const handleDelete = async () => {
    try {
      await deletePurchase.mutateAsync(id!)
      toast.success('Compra eliminada')
      navigate('/credit-purchases')
    } catch {
      toast.error('Error al eliminar')
    }
  }

  const progressPct = purchase.installment_count > 0
    ? (purchase.paid_installments / purchase.installment_count) * 100
    : 0

  return (
    <div className="relative space-y-6 pb-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-emerald-500/5 blur-3xl dark:bg-emerald-500/10" />
        <div className="absolute -right-40 top-60 h-80 w-80 rounded-full bg-teal-500/5 blur-3xl dark:bg-teal-500/10" />
      </div>

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/credit-purchases')}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            title="Volver"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[200px] sm:max-w-none">{purchase.item_name}</h2>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl border border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Eliminar Compra</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Esta accion eliminara permanentemente esta compra a credito y todas sus cuotas.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deletePurchase.isPending}
                className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-rose-600 rounded-xl hover:from-red-600 hover:to-rose-700 disabled:opacity-50 transition-all"
              >
                {deletePurchase.isPending ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
              <ShoppingCart className="h-7 w-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{purchase.item_name}</h1>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge status={purchase.status} />
                {purchase.store_name && (
                  <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Store className="h-3 w-3" />
                    {purchase.store_name}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <StatCard icon={DollarSign} label="Precio Total" value={formatCurrency(purchase.total_price)} color="text-gray-900 dark:text-gray-100" />
        <StatCard icon={PiggyBank} label="Pago Inicial" value={formatCurrency(purchase.down_payment)} color="text-blue-600 dark:text-blue-400" />
        <StatCard icon={CreditCard} label="Monto Financiado" value={formatCurrency(purchase.financed_amount)} color="text-emerald-600 dark:text-emerald-400" />
        <StatCard icon={Percent} label="Tasa de Interes" value={`${purchase.annual_interest_rate}%`} color="text-amber-600 dark:text-amber-400" />
        <StatCard icon={DollarSign} label={`Cuota ${FREQUENCY_LABELS[purchase.installment_frequency] || purchase.installment_frequency}`} value={formatCurrency(purchase.installment_amount)} color="text-emerald-600 dark:text-emerald-400" />
        <StatCard icon={TrendingUp} label="Interes Total" value={formatCurrency(purchase.total_interest)} color="text-red-600 dark:text-red-400" />
        <StatCard icon={DollarSign} label="Total Pagado" value={formatCurrency(purchase.total_paid)} color="text-emerald-600 dark:text-emerald-400" />
        <StatCard icon={Calendar} label="Compra" value={new Date(purchase.purchase_date).toLocaleDateString('es-DO', { day: '2-digit', month: 'short', year: 'numeric' })} color="text-gray-900 dark:text-gray-100" />
      </div>

      <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Progreso de Pagos</h3>
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{progressPct.toFixed(1)}%</span>
        </div>
        <div className="w-full h-4 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-600 transition-all duration-1000 ease-out"
            style={{ width: `${Math.min(progressPct, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs mt-2">
          <span className="text-gray-500 dark:text-gray-400">
            {purchase.paid_installments} de {purchase.installment_count} cuotas pagadas
          </span>
          <span className="text-gray-500 dark:text-gray-400">
            {FREQUENCY_LABELS[purchase.installment_frequency] || purchase.installment_frequency}
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Calculator className="h-4 w-4 text-gray-400" />
          Calendario de Cuotas
        </h3>
        <InstallmentTable
          installments={purchase.installments}
          purchaseId={purchase.id}
          canPay={purchase.status === 'active'}
        />
      </div>

      {purchase.description && (
        <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
            <Info className="h-4 w-4 text-gray-400" />
            Descripcion
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{purchase.description}</p>
        </div>
      )}

      {purchase.notes && (
        <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-400" />
            Notas
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{purchase.notes}</p>
        </div>
      )}
    </div>
  )
}
