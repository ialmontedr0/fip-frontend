import { useState, useMemo } from 'react'
import { Modal, Button } from '@/components/ui'
import { useAccounts } from '@/features/accounts/hooks/useAccounts'
import { cn, formatCurrency } from '@/lib/utils'
import { ACCOUNT_TYPE_CONFIG } from '@/features/accounts/constants'
import { Search, Check } from 'lucide-react'
import type { AccountType } from '@/types/accounts'

interface Props {
  isOpen: boolean
  onClose: () => void
  onAdd: (accountId: string) => void
  excludedIds: string[]
  isAdding: boolean
}

export default function AddAccountModal({ isOpen, onClose, onAdd, excludedIds, isAdding }: Props) {
  const { data, isLoading } = useAccounts()
  const [searchQuery, setSearchQuery] = useState('')

  const availableAccounts = useMemo(() => {
    if (!data?.accounts) return []
    const excluded = new Set(excludedIds)
    return data.accounts.filter((a) => !excluded.has(a.id))
  }, [data, excludedIds])

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return availableAccounts
    const q = searchQuery.toLowerCase()
    return availableAccounts.filter(
      (a) => a.name.toLowerCase().includes(q) || a.institution?.toLowerCase().includes(q),
    )
  }, [availableAccounts, searchQuery])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Agregar Cuenta al Wallet">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar cuentas..."
            className={cn(
              'w-full rounded-xl border border-gray-200 bg-white/70 py-2.5 pl-10 pr-3 text-sm backdrop-blur-sm',
              'dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-200',
              'focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20',
              'placeholder:text-gray-400',
            )}
          />
        </div>

        {isLoading ? (
          <div className="py-10 text-center text-sm text-gray-400">Cargando cuentas...</div>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-gray-400">
              {availableAccounts.length === 0
                ? 'No hay cuentas disponibles para agregar'
                : 'No se encontraron cuentas'}
            </p>
          </div>
        ) : (
          <div className="max-h-80 space-y-1 overflow-y-auto -mx-2 px-2">
            {filtered.map((account) => {
              const config = ACCOUNT_TYPE_CONFIG[account.account_type as AccountType]
              const Icon = config?.icon
              return (
                <button
                  key={account.id}
                  type="button"
                  onClick={() => onAdd(account.id)}
                  disabled={isAdding}
                  className={cn(
                    'group flex w-full items-center gap-3 rounded-xl border border-gray-100/80 p-3 text-left transition-all',
                    'dark:border-gray-700/50',
                    'hover:border-primary-200 hover:bg-gradient-to-r hover:from-primary-50/50 hover:to-transparent',
                    'dark:hover:border-primary-700 dark:hover:from-primary-500/10 dark:hover:to-transparent',
                  )}
                >
                  <div className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-105',
                    config?.bgColor ?? 'bg-gray-100',
                    config?.color ?? 'text-gray-500',
                  )}>
                    {Icon && <Icon className="h-[18px] w-[18px]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{account.name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{config?.label} &middot; {account.institution || account.currency_code}</p>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      'text-sm font-semibold tabular-nums',
                      parseFloat(account.balance) >= 0
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-red-600 dark:text-red-400',
                    )}>
                      {formatCurrency(parseFloat(account.balance), account.currency_code)}
                    </p>
                  </div>
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-gray-200 dark:border-gray-600">
                    <Check className="h-3.5 w-3.5 text-transparent transition-colors group-hover:text-primary-500" />
                  </div>
                </button>
              )
            })}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
        </div>
      </div>
    </Modal>
  )
}
