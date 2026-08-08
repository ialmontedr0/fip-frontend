import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { cn, formatCurrency, formatISODate } from '@/lib/utils'
import {
  ArrowLeft, Edit3, Trash2, Repeat,
  Building2, Calendar, Clock, Tag, FileText,
  Database, Brain, RefreshCw,
} from 'lucide-react'
import { Button, Skeleton } from '@/components/ui'
import { useTransaction, useDeleteTransaction } from '../hooks/useTransactions'
import { useAccount } from '@/features/accounts/hooks/useAccounts'
import { TRANSACTION_TYPE_CONFIG } from '../constants'
import TransactionTypeBadge from '../components/TransactionTypeBadge'
import TransactionStatusBadge from '../components/TransactionStatusBadge'
import TagSection from '../components/TagSection'
import AttachmentUploader from '../components/AttachmentUploader'
import AttachmentList from '../components/AttachmentList'
import AuditLogViewer from '../components/AuditLogViewer'
import TransactionQuickActions from '../components/TransactionQuickActions'
import DeleteTransactionModal from '../components/DeleteTransactionModal'

export default function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: transaction, isLoading, isError, refetch } = useTransaction(id)
  const deleteTransaction = useDeleteTransaction()
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const { data: accountData } = useAccount(transaction?.account_id || undefined)

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
      </div>
    )
  }

  if (isError || !transaction) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="rounded-full bg-red-100 dark:bg-red-500/10 p-4 mb-4">
          <Brain className="h-8 w-8 text-red-500" />
        </div>
        <p className="text-gray-500 dark:text-gray-400 mb-4">Error al cargar la transaccion</p>
        <Button variant="outline" onClick={() => refetch()} className="rounded-xl">
          <RefreshCw className="h-4 w-4 mr-2" />
          Reintentar
        </Button>
      </div>
    )
  }

  const typeConfig = transaction ? TRANSACTION_TYPE_CONFIG[transaction.transaction_type as keyof typeof TRANSACTION_TYPE_CONFIG] : null
  const amount = transaction ? parseFloat(transaction.amount) : 0
  const isNegative = transaction ? transaction.transaction_type === 'expense' || transaction.transaction_type === 'adjustment' : false
  const accountDisplay = accountData
    ? `${accountData.name}${accountData.account_number_last4 ? ' ····' + accountData.account_number_last4 : ''}`
    : transaction?.account_id || '—'
  const sourceDisplay = transaction?.source
    ? transaction.source.charAt(0).toUpperCase() + transaction.source.slice(1)
    : '—'

  const handleDelete = async () => {
    await deleteTransaction.mutateAsync(transaction.id)
    setShowDeleteModal(false)
    navigate('/transactions')
  }

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-emerald-200/20 dark:bg-emerald-500/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-red-200/20 dark:bg-red-500/5 blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto space-y-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={() => navigate('/transactions')}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
                  {transaction.description}
                </h1>
                <TransactionStatusBadge status={transaction.status} size="md" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {transaction.effective_date
                  ? formatISODate(transaction.effective_date, 'long')
                  : 'Sin fecha'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <TransactionQuickActions transaction={transaction} />
            <button
              onClick={() => navigate(`/transactions/${transaction.id}/edit`)}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-all"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm overflow-hidden">
          <div className={cn('h-2 bg-gradient-to-r', typeConfig?.gradient || 'from-gray-400 to-gray-600')} />
          <div className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 mb-6">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'flex h-14 w-14 items-center justify-center rounded-2xl',
                  typeConfig?.bgColor || 'bg-gray-100 dark:bg-gray-700',
                )}>
                  {typeConfig && <typeConfig.icon className={cn('h-7 w-7', typeConfig.color)} />}
                </div>
                <div>
                  <TransactionTypeBadge type={transaction.transaction_type} size="md" />
                  <p className="text-xs text-gray-400 mt-1">#{transaction.id.slice(0, 8)}</p>
                </div>
              </div>
              <p className={cn(
                'text-3xl font-bold tabular-nums tracking-tight',
                isNegative ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400',
              )}>
                {isNegative ? '−' : '+'}{formatCurrency(amount, transaction.currency_code)}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <InfoItem icon={Building2} label="Cuenta" value={accountDisplay} />
              <InfoItem icon={Calendar} label="Fecha" value={transaction.effective_date ? formatISODate(transaction.effective_date) : '—'} />
              <InfoItem icon={Clock} label="Creado" value={transaction.created_at ? new Date(transaction.created_at).toLocaleDateString('es-DO') : '—'} />
              <InfoItem icon={Tag} label="Origen" value={sourceDisplay} />
            </div>

            {transaction.notes && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>{transaction.notes}</p>
                </div>
              </div>
            )}

            {transaction.transfer_id && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                <div className="rounded-xl bg-blue-50 dark:bg-blue-500/10 px-4 py-2.5 flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                  <Repeat className="h-4 w-4" />
                  <span>Transferencia #{transaction.transfer_id.slice(0, 8)}</span>
                </div>
              </div>
            )}

            {(transaction.ai_category_id || transaction.ai_confidence) && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">AI Metadata</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-gray-500 dark:text-gray-400">
                  {transaction.ai_category_id && <div><span className="text-gray-400">Categoria AI:</span> {transaction.ai_category_id}</div>}
                  {transaction.ai_confidence !== null && transaction.ai_confidence !== undefined && (() => { const conf = Number(transaction.ai_confidence); return <div><span className="text-gray-400">Confianza:</span> {isFinite(conf) ? `${conf.toFixed(1)}%` : '-'}</div> })()}
                  {transaction.ai_model_version && <div><span className="text-gray-400">Modelo:</span> {transaction.ai_model_version}</div>}
                  {transaction.ai_reason && <div className="col-span-full"><span className="text-gray-400">Razon:</span> {transaction.ai_reason}</div>}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm p-6">
          <TagSection transaction={transaction} />
        </div>

        <div className="rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Database className="h-4 w-4 text-gray-400" />
            Archivos Adjuntos
          </h3>
          <AttachmentUploader transactionId={transaction.id} />
          <AttachmentList
            attachments={transaction.attachments}
            transactionId={transaction.id}
          />
        </div>

        <AuditLogViewer transactionId={transaction.id} />
      </div>

      <DeleteTransactionModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        description={transaction.description}
        hasAttachments={transaction.attachments.length > 0}
        attachmentCount={transaction.attachments.length}
        isTransfer={!!transaction.transfer_id}
        isLoading={deleteTransaction.isPending}
      />
    </div>
  )
}

function InfoItem({ icon: Icon, label, value }: { icon: typeof Building2; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[140px]">{value}</p>
      </div>
    </div>
  )
}
