import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAccount, useUpdateAccount, useDeleteAccount } from '../hooks/useAccounts'
import AccountForm, { type AccountFormData } from '../components/AccountForm'
import AccountStatusBadge from '../components/AccountStatusBadge'
import AccountTypeBadge from '../components/AccountTypeBadge'
import DeleteAccountModal from '../components/DeleteAccountModal'
import { Button, Skeleton, ErrorMessage } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import {
  ArrowLeft, Edit2, Trash2, Building, Hash, Calendar,
  CheckSquare, Square, FileText, Wallet, ArrowRight,
} from 'lucide-react'
import { useTransactionInfinite } from '@/features/transactions/hooks/useTransactions'
import TransactionCard from '@/features/transactions/components/TransactionCard'
import DebitCardSection from '@/features/debitCards/components/DebitCardSection'

export default function AccountDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: account, isLoading, isError, error } = useAccount(id)
  const updateAccount = useUpdateAccount()
  const deleteAccount = useDeleteAccount()

  const {
    data: txData,
    isLoading: txLoading,
  } = useTransactionInfinite({ account_id: id, page_size: 5 })

  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleUpdate = async (formData: AccountFormData) => {
    if (!id) return
    try {
      await updateAccount.mutateAsync({
        id,
        data: {
          name: formData.name,
          institution: formData.institution || null,
          account_number_last4: formData.account_number_last4 || null,
          color: formData.color || null,
          notes: formData.notes || null,
          include_in_net_worth: formData.include_in_net_worth,
          include_in_totals: formData.include_in_totals,
        },
      })
      setIsEditing(false)
    } catch {
      // Error toast is handled by the mutation hook
    }
  }

  const handleDelete = async () => {
    if (!id) return
    try {
      await deleteAccount.mutateAsync(id)
      navigate('/accounts')
    } catch {
      // Error toast is handled by the mutation hook
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 pb-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-44 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    )
  }

  if (isError || !account) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <ErrorMessage
          message={(error as Error)?.message || 'No se pudo cargar la cuenta'}
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  if (isEditing) {
    return (
      <div className="relative max-w-2xl mx-auto pb-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-primary-200/20 to-purple-200/10 blur-3xl dark:from-primary-500/10 dark:to-purple-500/5" />
        <div className="flex items-center gap-3 mb-6 animate-fade-in">
          <button onClick={() => setIsEditing(false)} className="rounded-xl p-2.5 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Editar: {account.name}</h1>
            <p className="text-sm text-gray-500">Actualiza los datos de la cuenta</p>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-gray-100/80 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-gray-800/80 dark:bg-gray-900/80 animate-fade-in">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400" />
          <div className="relative">
            <AccountForm
              defaultValues={{
                name: account.name,
                account_type: account.account_type as AccountFormData['account_type'],
                currency_code: account.currency_code,
                institution: account.institution || '',
                account_number_last4: account.account_number_last4 || '',
                color: account.color || '',
                notes: account.notes || '',
                include_in_net_worth: account.include_in_net_worth,
                include_in_totals: account.include_in_totals,
              }}
              onSubmit={handleUpdate}
              isSubmitting={updateAccount.isPending}
              mode="edit"
            />
          </div>
        </div>
      </div>
    )
  }

  const isPositive = parseFloat(account.balance) >= 0
  const transactions = txData?.pages.flatMap((p) => p.transactions) ?? []

  return (
    <div className="relative max-w-2xl mx-auto space-y-6 pb-8">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -left-20 -top-10 h-60 w-60 rounded-full bg-gradient-to-br from-primary-200/20 to-purple-200/10 blur-3xl dark:from-primary-500/10 dark:to-purple-500/5" />
      <div className="pointer-events-none absolute -right-16 top-40 h-48 w-48 rounded-full bg-gradient-to-br from-sky-200/10 to-emerald-200/10 blur-3xl dark:from-sky-500/5 dark:to-emerald-500/5" />

      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/accounts')} className="rounded-xl p-2.5 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{account.name}</h1>
            <p className="text-sm text-gray-500">Detalle de la cuenta</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit2 className="mr-1.5 h-4 w-4" />
            Editar
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setShowDeleteModal(true)}>
            <Trash2 className="mr-1.5 h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </div>

      {/* Balance Card */}
      <div className={cn(
        'relative overflow-hidden rounded-2xl border border-gray-100/80 bg-white/80 p-6 backdrop-blur-xl shadow-sm',
        'dark:border-gray-800/80 dark:bg-gray-900/80',
        'animate-fade-in',
      )} style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
        <div className={cn(
          'absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r',
          isPositive ? 'from-emerald-400 to-emerald-600' : 'from-red-400 to-red-600',
        )} />
        <div className={cn(
          'absolute -bottom-10 -right-10 h-32 w-32 rounded-full opacity-10 blur-3xl',
          isPositive ? 'bg-emerald-400' : 'bg-red-400',
        )} />

        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Balance Actual</p>
            <p className={cn(
              'text-3xl font-bold tracking-tight mt-1',
              isPositive
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-red-600 dark:text-red-400',
            )}>
              {formatCurrency(parseFloat(account.balance), account.currency_code)}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <AccountTypeBadge type={account.account_type} />
              <AccountStatusBadge status={account.status} />
            </div>
          </div>
          <div className={cn(
            'flex h-16 w-16 items-center justify-center rounded-2xl',
            'bg-gradient-to-br shadow-lg',
            isPositive ? 'from-emerald-50 to-emerald-100 dark:from-emerald-500/20 dark:to-emerald-500/10' : 'from-red-50 to-red-100 dark:from-red-500/20 dark:to-red-500/10',
          )}>
            <Wallet className={cn('h-7 w-7', isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400')} />
          </div>
        </div>
      </div>

      {/* Details */}
      <div className={cn(
        'relative overflow-hidden rounded-2xl border border-gray-100/80 bg-white/80 p-6 backdrop-blur-xl shadow-sm',
        'dark:border-gray-800/80 dark:bg-gray-900/80',
        'animate-fade-in',
      )} style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-400 via-purple-400 to-primary-400" />

        <div className="relative">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-5">
            Informacion de la Cuenta
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 rounded-xl bg-gray-50/50 p-3 dark:bg-gray-800/50">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-gray-700 shadow-sm">
                <Building className="h-4 w-4 text-gray-400" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Institucion</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{account.institution || 'No especificada'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-gray-50/50 p-3 dark:bg-gray-800/50">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-gray-700 shadow-sm">
                <Hash className="h-4 w-4 text-gray-400" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Ultimos 4 Digitos</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{account.account_number_last4 || '---'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-gray-50/50 p-3 dark:bg-gray-800/50">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-gray-700 shadow-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Creada</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {account.created_at ? new Date(account.created_at).toLocaleDateString('es-DO', { year: 'numeric', month: 'long', day: 'numeric' }) : '---'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-gray-50/50 p-3 dark:bg-gray-800/50">
              <div className={cn(
                'flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-gray-700 shadow-sm',
              )}>
                {account.include_in_net_worth ? (
                  <CheckSquare className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Square className="h-4 w-4 text-gray-400" />
                )}
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Patrimonio Neto</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {account.include_in_net_worth ? 'Incluido' : 'Excluido'}
                </p>
              </div>
            </div>
          </div>

          {account.notes && (
            <div className="mt-4 flex items-start gap-3 rounded-xl bg-gray-50/50 p-3 dark:bg-gray-800/50">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-gray-700 shadow-sm">
                <FileText className="h-4 w-4 text-gray-400" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Notas</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{account.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Debit Cards */}
      {account?.account_type === 'bank' || account?.account_type === 'checking' ? (
        <div className="animate-fade-in" style={{ animationDelay: '0.25s', animationFillMode: 'both' }}>
          <DebitCardSection accountId={account.id} />
        </div>
      ) : null}

      {/* Recent Transactions */}
      <div className={cn(
        'relative overflow-hidden rounded-2xl border border-gray-100/80 bg-white/80 p-6 backdrop-blur-xl shadow-sm',
        'dark:border-gray-800/80 dark:bg-gray-900/80',
        'animate-fade-in',
      )} style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-primary-400 to-emerald-400" />

        <div className="relative">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Ultimos Movimientos
            </h3>
            <button
              onClick={() => navigate(`/transactions?account_id=${id}`)}
              className="flex items-center gap-1 text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              Ver todos
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {txLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 rounded-xl bg-gray-100/50 dark:bg-gray-800/50 animate-pulse" />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-8 text-center">
              <Wallet className="h-8 w-8 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
              <p className="text-sm text-gray-400 dark:text-gray-500">No hay movimientos registrados</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/transactions/new')}
                className="mt-3 rounded-xl"
              >
                Crear Primera Transaccion
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.map((tx, i) => (
                <div
                  key={tx.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <TransactionCard transaction={tx} />
                </div>
              ))}
              <button
                onClick={() => navigate(`/transactions?account_id=${id}`)}
                className="w-full py-2.5 text-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 rounded-xl transition-all"
              >
                Ver todas las transacciones
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        accountName={account.name}
        isDeleting={deleteAccount.isPending}
      />
    </div>
  )
}
