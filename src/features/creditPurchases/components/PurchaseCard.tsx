import { ShoppingCart, Store, DollarSign } from 'lucide-react'
import type { CreditPurchaseListItem } from '@/types/creditPurchases'
import { formatCurrency } from '@/lib/utils'
import StatusBadge from './StatusBadge'
import { FREQUENCY_LABELS } from '../constants'

export default function PurchaseCard({ purchase, index }: { purchase: CreditPurchaseListItem; index: number }) {
  return (
    <div
      className="group bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-emerald-200 dark:hover:border-emerald-500/30 animate-fade-in"
      style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'both' }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md shadow-emerald-500/20 shrink-0">
          <ShoppingCart className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
            {purchase.item_name}
          </h3>
          {purchase.store_name && (
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Store className="h-3 w-3" />
              <span className="truncate">{purchase.store_name}</span>
            </div>
          )}
        </div>
        <StatusBadge status={purchase.status} />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">Precio</p>
          <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{formatCurrency(purchase.total_price)}</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">Cuota</p>
          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(purchase.installment_amount)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
        <span>{purchase.paid_installments}/{purchase.total_installments} cuotas</span>
        <span>{FREQUENCY_LABELS[purchase.installment_frequency] || purchase.installment_frequency}</span>
      </div>

      <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-600 transition-all duration-1000 ease-out"
          style={{ width: `${purchase.total_installments > 0 ? (purchase.paid_installments / purchase.total_installments) * 100 : 0}%` }}
        />
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <DollarSign className="h-3 w-3" />
          <span>Financiado: {formatCurrency(purchase.financed_amount)}</span>
        </div>
        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
          {purchase.paid_installments}/{purchase.total_installments} pagadas
        </span>
      </div>
    </div>
  )
}
