import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, TrendingUp, Plus, Trash2, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAsset, usePortfolios, useCreateInvestmentTransaction, useAddPricePoint, useAssetPriceHistory, useDeleteAsset } from '../hooks/useInvestments'
import AssetTypeBadge from '../components/AssetTypeBadge'
import TxTypeBadge from '../components/TxTypeBadge'
import PriceHistoryChart from '../components/PriceHistoryChart'
import InvestmentTransactionForm from '../components/InvestmentTransactionForm'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { CreateInvestmentTransactionRequest } from '@/types/investment'

export default function AssetDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [showTxForm, setShowTxForm] = useState(false)
  const [showPriceForm, setShowPriceForm] = useState(false)
  const [priceValue, setPriceValue] = useState('')

  const { data: asset, isLoading } = useAsset(id)
  const { data: portfoliosData } = usePortfolios()
  const { data: history, isLoading: historyLoading } = useAssetPriceHistory(id)
  const createTx = useCreateInvestmentTransaction(id)
  const addPrice = useAddPricePoint(id)
  const deleteAsset = useDeleteAsset()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-40 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
      </div>
    )
  }

  if (!asset) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-gray-500 dark:text-gray-400">Activo no encontrado</p>
        <button type="button" onClick={() => navigate('/investments')} className="mt-4 text-sm text-blue-500 hover:underline">
          Volver a inversiones
        </button>
      </div>
    )
  }

  const portfolios = portfoliosData?.portfolios || []

  const handleDelete = async () => {
    if (!window.confirm(`Eliminar el activo "${asset.name}"?`)) return
    try {
      await deleteAsset.mutateAsync(asset.id)
      toast.success('Activo eliminado')
      navigate('/investments')
    } catch (err: any) {
      toast.error(err?.message || 'Error al eliminar el activo')
    }
  }

  const handleTxSubmit = async (data: CreateInvestmentTransactionRequest) => {
    try {
      await createTx.mutateAsync(data)
      toast.success('Transaccion registrada')
      setShowTxForm(false)
    } catch (err: any) {
      toast.error(err?.message || 'Error al registrar la transaccion')
    }
  }

  const handlePriceSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const close = Number(priceValue)
    if (isNaN(close) || close < 0) {
      toast.error('Ingresa un precio valido')
      return
    }
    try {
      await addPrice.mutateAsync({ close_price: close })
      toast.success('Precio actualizado')
      setShowPriceForm(false)
      setPriceValue('')
    } catch (err: any) {
      toast.error(err?.message || 'Error al actualizar el precio')
    }
  }

  return (
    <div className="relative space-y-6 pb-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-blue-500/5 blur-3xl dark:bg-blue-500/10" />
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">{asset.name}</h1>
                {asset.symbol && <span className="text-sm text-gray-400 dark:text-gray-500">{asset.symbol}</span>}
                <AssetTypeBadge type={asset.asset_type} />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Precio actual: <span className="font-semibold text-gray-900 dark:text-white">
                  {asset.current_price !== null ? formatCurrency(asset.current_price, asset.currency) : '--'}
                </span>
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowPriceForm(!showPriceForm)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              <Save className="h-4 w-4" />
              Actualizar Precio
            </button>
            <button
              type="button"
              onClick={() => setShowTxForm(!showTxForm)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              Transaccion
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-2 px-3 py-2.5 text-sm font-semibold rounded-xl border border-red-200 dark:border-red-900/50 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {showPriceForm && (
          <form onSubmit={handlePriceSubmit} className="mb-6 flex flex-wrap items-end gap-3 rounded-2xl border border-gray-100 dark:border-gray-700/50 bg-white dark:bg-gray-800/80 p-4 shadow-sm animate-fade-in">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Precio de cierre ({asset.currency})</label>
              <input
                type="number"
                step="0.0001"
                min="0"
                value={priceValue}
                onChange={(e) => setPriceValue(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={addPrice.isPending}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 transition-all"
            >
              {addPrice.isPending ? 'Guardando...' : 'Guardar'}
            </button>
          </form>
        )}

        {showTxForm && (
          <div className="mb-6 rounded-2xl border border-gray-100 dark:border-gray-700/50 bg-white dark:bg-gray-800/80 p-5 shadow-sm animate-fade-in">
            <InvestmentTransactionForm
              assetName={asset.name}
              portfolios={portfolios}
              onSubmit={handleTxSubmit}
              onCancel={() => setShowTxForm(false)}
              isPending={createTx.isPending}
            />
          </div>
        )}

        <div className="rounded-2xl border border-gray-100 dark:border-gray-700/50 bg-white dark:bg-gray-800/80 p-6 shadow-sm mb-6">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
            Historial de Precios
          </h2>
          <PriceHistoryChart history={history} loading={historyLoading} currency={asset.currency} />
        </div>

        <div className="rounded-2xl border border-gray-100 dark:border-gray-700/50 bg-white dark:bg-gray-800/80 p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
            Transacciones ({asset.transactions_count})
          </h2>
          {asset.transactions.length === 0 ? (
            <div className="flex items-center justify-center py-10 text-sm text-gray-400">
              Sin transacciones registradas
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    <th className="pb-3">Tipo</th>
                    <th className="pb-3">Cantidad</th>
                    <th className="pb-3">Precio</th>
                    <th className="pb-3">Comisiones</th>
                    <th className="pb-3">Total</th>
                    <th className="pb-3">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {asset.transactions.map((tx) => (
                    <tr key={tx.id} className="text-gray-900 dark:text-gray-100">
                      <td className="py-3"><TxTypeBadge type={tx.type} /></td>
                      <td className="py-3 tabular-nums">{tx.quantity}</td>
                      <td className="py-3 tabular-nums">{formatCurrency(tx.price_per_unit, asset.currency)}</td>
                      <td className="py-3 tabular-nums">{formatCurrency(tx.fees, asset.currency)}</td>
                      <td className="py-3 font-semibold tabular-nums">{formatCurrency(tx.total_amount, asset.currency)}</td>
                      <td className="py-3 text-gray-500 dark:text-gray-400">{formatDate(tx.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
