import { Wallet, ArrowUpDown, Gauge } from 'lucide-react'
import { useAccounts } from '@/features/accounts/hooks/useAccounts'
import type { BalanceThresholdConditions, Direction } from '@/types/automations'

interface Props {
  value: BalanceThresholdConditions | null
  onChange: (conditions: BalanceThresholdConditions) => void
}

export default function BalanceThresholdCondition({ value, onChange }: Props) {
  const { data: accountsData } = useAccounts()
  const threshold = value?.threshold ?? 0
  const maxVal = Math.max(threshold, 10000)

  return (
    <div className="space-y-4">
      <div className="group">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Cuenta</label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-500/20">
            <Wallet className="h-3 w-3 text-white" />
          </div>
          <select
            value={value?.account_id ?? ''}
            onChange={(e) => onChange({ ...value, account_id: e.target.value } as BalanceThresholdConditions)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all appearance-none"
          >
            <option value="">Seleccionar cuenta...</option>
            {accountsData?.accounts?.map((acc) => (
              <option key={acc.id} value={acc.id}>{acc.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="group">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
          Umbral: <span className="text-blue-500 dark:text-blue-400">${threshold.toLocaleString()}</span>
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-cyan-600 shadow-lg shadow-blue-500/20">
            <Gauge className="h-3 w-3 text-white" />
          </div>
          <input
            type="number"
            min={0}
            step="0.01"
            value={value?.threshold ?? ''}
            onChange={(e) => onChange({ ...value, threshold: Number(e.target.value) } as BalanceThresholdConditions)}
            placeholder="0.00"
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all"
          />
        </div>
      </div>
      <div className="group">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Dirección</label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600 shadow-lg shadow-indigo-500/20">
            <ArrowUpDown className="h-3 w-3 text-white" />
          </div>
          <select
            value={value?.direction ?? ''}
            onChange={(e) => onChange({ ...value, direction: e.target.value as Direction } as BalanceThresholdConditions)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all appearance-none"
          >
            <option value="above">Por encima del umbral</option>
            <option value="below">Por debajo del umbral</option>
          </select>
        </div>
      </div>
      {value?.account_id && (
        <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-500"
            style={{ width: `${Math.min((threshold / maxVal) * 100, 100)}%` }}
          />
        </div>
      )}
    </div>
  )
}
