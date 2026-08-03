import { useNavigate } from 'react-router-dom'
import { Plus, TrendingUp, FolderPlus, PieChart } from 'lucide-react'
import { useInvestmentSummary, useAssets, usePortfolios } from '../hooks/useInvestments'
import PortfolioDashboardCards from '../components/PortfolioDashboardCards'
import AssetCard from '../components/AssetCard'
import PortfolioCard from '../components/PortfolioCard'

export default function InvestmentsPage() {
  const navigate = useNavigate()
  const { data: summary, isLoading: summaryLoading } = useInvestmentSummary()
  const { data: assetsData, isLoading: assetsLoading } = useAssets()
  const { data: portfoliosData, isLoading: portfoliosLoading } = usePortfolios()

  const assets = assetsData?.assets || []
  const portfolios = portfoliosData?.portfolios || []
  const isLoading = summaryLoading || assetsLoading || portfoliosLoading

  return (
    <div className="relative space-y-6 pb-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-blue-500/5 blur-3xl dark:bg-blue-500/10" />
        <div className="absolute -right-40 top-60 h-80 w-80 rounded-full bg-indigo-500/5 blur-3xl dark:bg-indigo-500/10" />
      </div>

      {summary && !isLoading && (
        <div className="relative animate-fade-in">
          <PortfolioDashboardCards summary={summary} />
        </div>
      )}

      <div className="relative animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
              <PieChart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Inversiones</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Portafolios, activos y rendimiento
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate('/investments/assets/new')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              Nuevo Activo
            </button>
            <button
              type="button"
              onClick={() => navigate('/investments/portfolios/new')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25 transition-all duration-200"
            >
              <FolderPlus className="h-4 w-4" />
              Portafolio
            </button>
          </div>
        </div>
      </div>

      <div className="relative animate-fade-in" style={{ animationDelay: '0.05s', animationFillMode: 'both' }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Portafolios
          </h2>
          <span className="text-xs text-gray-400 dark:text-gray-500">{portfolios.length}</span>
        </div>
        {portfoliosLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 animate-pulse">
                <div className="h-10 w-10 rounded-xl bg-gray-200 dark:bg-gray-700 mb-3" />
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            ))}
          </div>
        ) : portfolios.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolios.map((portfolio, idx) => (
              <div
                key={portfolio.id}
                onClick={() => navigate(`/investments/portfolios/${portfolio.id}`)}
                className="cursor-pointer"
              >
                <PortfolioCard portfolio={portfolio} index={idx} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
            <FolderPlus className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Crea tu primer portafolio para organizar tus inversiones
            </p>
          </div>
        )}
      </div>

      <div className="relative animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Activos
          </h2>
          <span className="text-xs text-gray-400 dark:text-gray-500">{assets.length}</span>
        </div>
        {assetsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-gray-200 dark:bg-gray-700" />
                  <div className="flex-1">
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded mt-1" />
                  </div>
                </div>
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
              </div>
            ))}
          </div>
        ) : assets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assets.map((asset, idx) => (
              <div
                key={asset.id}
                onClick={() => navigate(`/investments/assets/${asset.id}`)}
                className="cursor-pointer"
              >
                <AssetCard asset={asset} index={idx} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
            <TrendingUp className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No tienes activos aun
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
              Registra tus acciones, bonos, ETF, criptomonedas y mas para dar seguimiento a tu portafolio
            </p>
            <button
              type="button"
              onClick={() => navigate('/investments/assets/new')}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              Nuevo Activo
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
