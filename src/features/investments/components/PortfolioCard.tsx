import { FolderOpen } from 'lucide-react'
import type { Portfolio } from '@/types/investment'

interface Props {
  portfolio: Portfolio
  index?: number
}

export default function PortfolioCard({ portfolio, index = 0 }: Props) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-700/50 bg-white dark:bg-gray-800/80 p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 animate-fade-in"
      style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'both' }}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 to-purple-600" />

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20">
            <FolderOpen className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-white">
              {portfolio.name}
            </h3>
            {portfolio.description && (
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                {portfolio.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {portfolio.asset_count} activo{portfolio.asset_count !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  )
}
