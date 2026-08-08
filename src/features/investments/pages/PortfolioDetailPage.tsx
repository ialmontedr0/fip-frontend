import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, FolderOpen, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { usePortfolio, useDeletePortfolio } from '../hooks/useInvestments'
import AssetTypeBadge from '../components/AssetTypeBadge'
import TxTypeBadge from '../components/TxTypeBadge'
import { formatCurrency, formatDate } from '@/lib/utils'
import useConfirm from '@/hooks/useConfirm'

export default function PortfolioDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { data: portfolio, isLoading } = usePortfolio(id)
  const deletePortfolio = useDeletePortfolio()
  const { confirm, confirmDialog } = useConfirm()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-40 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
      </div>
    )
  }

  if (!portfolio) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-gray-500 dark:text-gray-400">Portafolio no encontrado</p>
        <button type="button" onClick={() => navigate('/investments')} className="mt-4 text-sm text-blue-500 hover:underline">
          Volver a inversiones
        </button>
      </div>
    )
  }

  const handleDelete = async () => {
    if (!(await confirm({ title: 'Eliminar portafolio', message: `Eliminar el portafolio "${portfolio.name}"?`, confirmLabel: 'Eliminar', destructive: true }))) return
    try {
      await deletePortfolio.mutateAsync(portfolio.id)
      toast.success('Portafolio eliminado')
      navigate('/investments')
    } catch (err: any) {
      toast.error(err?.message || 'Error al eliminar el portafolio')
    }
  }

  const totalMarketValue = portfolio.assets.reduce((sum, a) => sum + a.market_value, 0)
  const totalCost = portfolio.assets.reduce((sum, a) => sum + a.cost_basis, 0)
  const gainLoss = totalMarketValue - totalCost

  return (
    <div className="relative space-y-6 pb-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-violet-500/5 blur-3xl dark:bg-violet-500/10" />
        <div className="absolute -right-40 top-60 h-80 w-80 rounded-full bg-purple-500/5 blur-3xl dark:bg-purple-500/10" />
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
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20">
              <FolderOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">{portfolio.name}</h1>
              {portfolio.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400">{portfolio.description}</p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-2 px-3 py-2.5 text-sm font-semibold rounded-xl border border-red-200 dark:border-red-900/50 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          >
            <Trash2 className="h-4 w-4" />
            Eliminar
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="rounded-2xl border border-gray-100 dark:border-gray-700/50 bg-white dark:bg-gray-800/80 p-5 shadow-sm">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Valor de Mercado</p>
            <p className="mt-2 text-lg font-bold text-gray-900 dark:text-white tabular-nums">{formatCurrency(totalMarketValue)}</p>
          </div>
          <div className="rounded-2xl border border-gray-100 dark:border-gray-700/50 bg-white dark:bg-gray-800/80 p-5 shadow-sm">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Costo</p>
            <p className="mt-2 text-lg font-bold text-gray-900 dark:text-white tabular-nums">{formatCurrency(totalCost)}</p>
          </div>
          <div className="rounded-2xl border border-gray-100 dark:border-gray-700/50 bg-white dark:bg-gray-800/80 p-5 shadow-sm">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ganancia / Perdida</p>
            <p className={`mt-2 text-lg font-bold tabular-nums ${gainLoss >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {formatCurrency(gainLoss)}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 dark:border-gray-700/50 bg-white dark:bg-gray-800/80 p-6 shadow-sm mb-6">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
            Activos ({portfolio.assets.length})
          </h2>
          {portfolio.assets.length === 0 ? (
            <div className="flex items-center justify-center py-10 text-sm text-gray-400">
              Aun no hay activos en este portafolio. Registra una compra desde la pagina del activo.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    <th className="pb-3">Activo</th>
                    <th className="pb-3">Tipo</th>
                    <th className="pb-3">Cantidad</th>
                    <th className="pb-3">Precio Prom.</th>
                    <th className="pb-3">Costo</th>
                    <th className="pb-3">Valor Mercado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {portfolio.assets.map((holding) => (
                    <tr
                      key={holding.asset_id}
                      className="text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      onClick={() => navigate(`/investments/assets/${holding.asset_id}`)}
                    >
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{holding.name}</span>
                          {holding.symbol && <span className="text-xs text-gray-400">{holding.symbol}</span>}
                        </div>
                      </td>
                      <td className="py-3"><AssetTypeBadge type={holding.asset_type} /></td>
                      <td className="py-3 tabular-nums">{holding.quantity}</td>
                      <td className="py-3 tabular-nums">{holding.average_price !== null ? formatCurrency(holding.average_price, holding.currency) : '--'}</td>
                      <td className="py-3 tabular-nums">{formatCurrency(holding.cost_basis, holding.currency)}</td>
                      <td className="py-3 font-semibold tabular-nums">{formatCurrency(holding.market_value, holding.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-gray-100 dark:border-gray-700/50 bg-white dark:bg-gray-800/80 p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
            Transacciones ({portfolio.transactions.length})
          </h2>
          {portfolio.transactions.length === 0 ? (
            <div className="flex items-center justify-center py-10 text-sm text-gray-400">
              Sin transacciones en este portafolio
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    <th className="pb-3">Tipo</th>
                    <th className="pb-3">Cantidad</th>
                    <th className="pb-3">Precio</th>
                    <th className="pb-3">Total</th>
                    <th className="pb-3">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {portfolio.transactions.map((tx) => (
                    <tr key={tx.id} className="text-gray-900 dark:text-gray-100">
                      <td className="py-3"><TxTypeBadge type={tx.type} /></td>
                      <td className="py-3 tabular-nums">{tx.quantity}</td>
                      <td className="py-3 tabular-nums">{formatCurrency(tx.price_per_unit)}</td>
                      <td className="py-3 font-semibold tabular-nums">{formatCurrency(tx.total_amount)}</td>
                      <td className="py-3 text-gray-500 dark:text-gray-400">{formatDate(tx.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {confirmDialog}
    </div>
  )
}
