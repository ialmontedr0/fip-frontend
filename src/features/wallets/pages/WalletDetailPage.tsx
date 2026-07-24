import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useWallet, useDeleteWallet, useAddAccountToWallet, useRemoveAccountFromWallet, useWalletBalance } from '../hooks/useWallets'
import WalletStatusBadge from '../components/WalletStatusBadge'
import WalletTypeBadge from '../components/WalletTypeBadge'
import DeleteWalletModal from '../components/DeleteWalletModal'
import AddAccountModal from '../components/AddAccountModal'
import { Button, Skeleton, ErrorMessage } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { ArrowLeft, Trash2, Plus, X, BarChart3, Building } from 'lucide-react'
import { ACCOUNT_TYPE_CONFIG } from '@/features/accounts/constants'
import type { AccountType } from '@/types/accounts'

export default function WalletDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: wallet, isLoading, isError, error } = useWallet(id)
  const { data: balance } = useWalletBalance(id)
  const deleteWallet = useDeleteWallet()
  const addAccount = useAddAccountToWallet()
  const removeAccount = useRemoveAccountFromWallet()

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)

  const handleDelete = async () => {
    if (!id) return
    await deleteWallet.mutateAsync(id)
    navigate('/wallets')
  }

  const handleAddAccount = async (accountId: string) => {
    if (!id) return
    await addAccount.mutateAsync({ walletId: id, data: { account_id: accountId } })
    setShowAddModal(false)
  }

  const handleRemoveAccount = async (accountId: string) => {
    if (!id) return
    await removeAccount.mutateAsync({ walletId: id, accountId })
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-44 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    )
  }

  if (isError || !wallet) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <ErrorMessage
          message={(error as Error)?.message || 'No se pudo cargar el wallet'}
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  return (
    <div className="relative max-w-3xl mx-auto space-y-6 pb-8">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -left-24 -top-10 h-64 w-64 rounded-full bg-gradient-to-br from-violet-200/20 to-fuchsia-200/10 blur-3xl dark:from-violet-500/10 dark:to-fuchsia-500/5" />
      <div className="pointer-events-none absolute -right-16 top-40 h-48 w-48 rounded-full bg-gradient-to-br from-sky-200/10 to-emerald-200/10 blur-3xl dark:from-sky-500/5 dark:to-emerald-500/5" />

      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/wallets')} className="rounded-xl p-2.5 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{wallet.name}</h1>
            <p className="text-sm text-gray-500">Detalle del wallet</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate(`/wallets/${id}/liquidity`)}>
            <BarChart3 className="mr-1.5 h-4 w-4" />
            Liquidez
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setShowDeleteModal(true)}>
            <Trash2 className="mr-1.5 h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </div>

      {/* Info Card */}
      <div className={cn(
        'relative overflow-hidden rounded-2xl border border-gray-100/80 bg-white/80 p-6 backdrop-blur-xl shadow-sm',
        'dark:border-gray-800/80 dark:bg-gray-900/80',
        'animate-fade-in',
      )} style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400" />
        <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br from-violet-400/10 to-fuchsia-400/5 blur-3xl" />

        <div className="relative flex items-start justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <WalletTypeBadge type={wallet.wallet_type} />
              <WalletStatusBadge status={wallet.status} />
            </div>
            {wallet.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">{wallet.description}</p>
            )}
          </div>
          {balance && (
            <div className="text-right space-y-1.5">
              {Object.entries(balance.by_currency).map(([currency, data]) => (
                <p key={currency} className={cn(
                  'text-base font-bold tabular-nums tracking-tight',
                  parseFloat(data.total_balance) >= 0
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-red-600 dark:text-red-400',
                )}>
                  {formatCurrency(parseFloat(data.total_balance), currency)}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Linked Accounts */}
      <div className={cn(
        'relative overflow-hidden rounded-2xl border border-gray-100/80 bg-white/80 p-6 backdrop-blur-xl shadow-sm',
        'dark:border-gray-800/80 dark:bg-gray-900/80',
        'animate-fade-in',
      )} style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-400 via-violet-400 to-primary-400" />

        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Cuentas Vinculadas
            </h3>
            <Button size="sm" onClick={() => setShowAddModal(true)}>
              <Plus className="mr-1.5 h-4 w-4" />
              Agregar Cuenta
            </Button>
          </div>

          {wallet.accounts.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <div className="rounded-full bg-gray-100 p-3 mb-3 dark:bg-gray-800">
                <Building className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                No hay cuentas vinculadas
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Agrega cuentas a este wallet para empezar
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {wallet.accounts.map((acc) => {
                const config = ACCOUNT_TYPE_CONFIG[acc.account_type as AccountType]
                const Icon = config?.icon
                return (
                  <div
                    key={acc.id}
                    className={cn(
                      'group flex items-center justify-between rounded-xl border border-gray-100 p-3 transition-all',
                      'dark:border-gray-700/50',
                      'hover:border-gray-200 hover:bg-gray-50/50 dark:hover:border-gray-600 dark:hover:bg-gray-800/30',
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-lg transition-transform group-hover:scale-105',
                        config?.bgColor ?? 'bg-gray-100',
                        config?.color ?? 'text-gray-500',
                      )}>
                        {Icon && <Icon className="h-[18px] w-[18px]" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{acc.name}</p>
                        <p className="text-xs text-gray-400">{config?.label} &middot; {acc.currency_code}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        'text-sm font-semibold tabular-nums',
                        parseFloat(acc.balance) >= 0
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-red-600 dark:text-red-400',
                      )}>
                        {formatCurrency(parseFloat(acc.balance), acc.currency_code)}
                      </span>
                      <button
                        onClick={() => handleRemoveAccount(acc.id)}
                        className="rounded-lg p-1.5 text-gray-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:text-gray-600 dark:hover:bg-red-500/10"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteWalletModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        walletName={wallet.name}
        isDeleting={deleteWallet.isPending}
      />

      {/* Add Account Modal */}
      <AddAccountModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddAccount}
        excludedIds={wallet.accounts.map((a) => a.id)}
        isAdding={addAccount.isPending}
      />
    </div>
  )
}
