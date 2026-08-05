import { useMemo, useState } from 'react'
import { RefreshCw, Trash2, Unplug } from 'lucide-react'
import PlaidLinkButton from '../components/PlaidLinkButton'
import { usePlaidItems, useDeletePlaidItem, usePlaidItemTransactions } from '../hooks/usePlaid'
import type { PlaidItem } from '../api/plaid'
import Modal from '@/components/ui/Modal'

export default function PlaidItemsPage() {
  const { data, isLoading, refetch } = usePlaidItems()
  const deleteMutation = useDeletePlaidItem()
  const [selected, setSelected] = useState<PlaidItem | null>(null)
  const items = data?.items ?? []

  const handleDelete = (item: PlaidItem) => {
    if (window.confirm(`Desvincular ${item.institution_name ?? 'cuenta'}?`)) {
      deleteMutation.mutate(item.id)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Cuentas bancarias conectadas</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Vincula tu banco para sincronizar transacciones automáticamente.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </button>
          <PlaidLinkButton onSuccess={() => refetch()} />
        </div>
      </div>

      {isLoading && <p className="text-sm text-gray-500">Cargando cuentas...</p>}

      {items.length === 0 && !isLoading && (
        <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-8 text-center">
          <Unplug className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Aún no hay cuentas conectadas. Vincula tu primera cuenta bancaria.
          </p>
        </div>
      )}

      <div className="grid gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 flex items-center justify-between"
          >
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {item.institution_name ?? 'Cuenta bancaria'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Estado: {item.status}
                {item.created_at && ` · ${new Date(item.created_at).toLocaleDateString('es-MX')}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelected(item)}
                className="px-3 py-2 text-sm font-medium text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-700 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-500/10"
              >
                Ver transacciones
              </button>
              <button
                type="button"
                aria-label="Desvincular"
                onClick={() => handleDelete(item)}
                className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {selected && <PlaidTransactionsModal item={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

function PlaidTransactionsModal({ item, onClose }: { item: PlaidItem; onClose: () => void }) {
  const range = useMemo(() => {
    const end = new Date()
    const start = new Date()
    start.setDate(end.getDate() - 90)
    return {
      start: start.toISOString().slice(0, 10),
      end: end.toISOString().slice(0, 10),
    }
  }, [])

  const { data, isLoading } = usePlaidItemTransactions(item.id, range.start, range.end)
  const transactions = data?.transactions ?? []

  return (
    <Modal isOpen onClose={onClose} title={`Transacciones — ${item.institution_name ?? 'Cuenta'}`} size="xl">
      <div className="space-y-2 max-h-[70vh] overflow-auto">
        {isLoading && <p className="text-sm text-gray-500 text-center py-8">Cargando transacciones...</p>}
        {!isLoading &&
          transactions.map((t) => (
            <div
              key={t.transaction_id}
              className="flex items-center justify-between text-sm border-b border-gray-100 dark:border-gray-800 pb-2"
            >
              <div>
                <p className="text-gray-900 dark:text-gray-100">{t.name ?? t.merchant_name ?? 'Sin nombre'}</p>
                <p className="text-xs text-gray-500">
                  {t.date ?? ''} {t.category ? `· ${t.category}` : ''}
                </p>
              </div>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {t.amount !== null && t.amount !== undefined
                  ? `$${Number(t.amount).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`
                  : ''}
              </span>
            </div>
          ))}
        {!isLoading && transactions.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-8">Sin transacciones sincronizadas.</p>
        )}
      </div>
    </Modal>
  )
}
