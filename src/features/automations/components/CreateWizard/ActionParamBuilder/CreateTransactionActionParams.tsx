import { Wallet, Tag, DollarSign, FileText, ArrowUpCircle, ArrowDownCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAccounts } from '@/features/accounts/hooks/useAccounts'
import { useCategories } from '@/features/categories/hooks/useCategories'
import type { CreateTransactionActionParams } from '@/types/automations'

interface Props {
  value: CreateTransactionActionParams | null
  onChange: (params: CreateTransactionActionParams) => void
}

export default function CreateTransactionActionParams({ value, onChange }: Props) {
  const { data: accountsData } = useAccounts()
  const { data: categoriesData } = useCategories()
  const txType = value?.transaction_type ?? 'expense'

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Tipo</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onChange({ ...value, transaction_type: 'expense' } as CreateTransactionActionParams)}
            className={cn(
              'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95',
              txType === 'expense'
                ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/25'
                : 'bg-white/80 dark:bg-gray-800/80 border border-gray-100/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400 hover:border-rose-200/50 dark:hover:border-rose-500/30',
            )}
          >
            <ArrowDownCircle className="h-4 w-4" />
            Gasto
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...value, transaction_type: 'income' } as CreateTransactionActionParams)}
            className={cn(
              'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95',
              txType === 'income'
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/25'
                : 'bg-white/80 dark:bg-gray-800/80 border border-gray-100/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400 hover:border-emerald-200/50 dark:hover:border-emerald-500/30',
            )}
          >
            <ArrowUpCircle className="h-4 w-4" />
            Ingreso
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="group">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Cuenta</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-500/20">
              <Wallet className="h-3 w-3 text-white" />
            </div>
            <select
              value={value?.account_id ?? ''}
              onChange={(e) => onChange({ ...value, account_id: e.target.value } as CreateTransactionActionParams)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all appearance-none"
            >
              <option value="">Seleccionar...</option>
              {accountsData?.accounts?.map((acc) => (
                <option key={acc.id} value={acc.id}>{acc.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="group">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Categoría</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 shadow-lg shadow-purple-500/20">
              <Tag className="h-3 w-3 text-white" />
            </div>
            <select
              value={value?.category_id ?? ''}
              onChange={(e) => onChange({ ...value, category_id: e.target.value || undefined } as CreateTransactionActionParams)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all appearance-none"
            >
              <option value="">Sin categoría</option>
              {categoriesData?.categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="group">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Monto</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-lg bg-gradient-to-br from-violet-400 to-violet-600 shadow-lg shadow-violet-500/20">
              <DollarSign className="h-3 w-3 text-white" />
            </div>
            <input
              type="number"
              min={0}
              step="0.01"
              value={value?.amount ?? ''}
              onChange={(e) => onChange({ ...value, amount: Number(e.target.value) } as CreateTransactionActionParams)}
              placeholder="0.00"
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all"
            />
          </div>
        </div>
        <div className="group">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Descripción</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-lg bg-gradient-to-br from-slate-400 to-slate-600 shadow-lg shadow-slate-500/20">
              <FileText className="h-3 w-3 text-white" />
            </div>
            <input
              value={value?.description ?? ''}
              onChange={(e) => onChange({ ...value, description: e.target.value } as CreateTransactionActionParams)}
              placeholder="Descripción"
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
