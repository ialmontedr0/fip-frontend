import { TrendingUp } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { ASSET_TYPE_COLORS } from '../constants'
import type { Asset } from '@/types/investment'
import AssetTypeBadge from './AssetTypeBadge'

interface Props {
  asset: Asset
  index?: number
}

export default function AssetCard({ asset, index = 0 }: Props) {
  const color = ASSET_TYPE_COLORS[asset.asset_type] || '#6b7280'

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-700/50 bg-white dark:bg-gray-800/80 p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 animate-fade-in"
      style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'both' }}
    >
      <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: color }} />

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
            style={{ backgroundColor: color }}
          >
            <TrendingUp className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-white">
              {asset.name}
            </h3>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
              {asset.symbol || asset.currency}
            </p>
          </div>
        </div>
        <AssetTypeBadge type={asset.asset_type} />
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Precio</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white tabular-nums">
            {asset.current_price !== null
              ? formatCurrency(asset.current_price, asset.currency)
              : '--'}
          </p>
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-500">{asset.currency}</span>
      </div>
    </div>
  )
}
