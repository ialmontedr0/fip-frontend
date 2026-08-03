import { useState } from 'react'
import { FileText, CalendarClock } from 'lucide-react'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import InsuranceTypeBadge from './InsuranceTypeBadge'
import InsuranceStatusBadge from './InsuranceStatusBadge'
import { FREQUENCY_LABELS } from '../constants'
import { INSURANCE_TYPE_COLORS } from '../constants'
import type { InsuranceListItem } from '@/types/insurance'

interface InsuranceCardProps {
  insurance: InsuranceListItem
  onClick?: () => void
  index?: number
}

export default function InsuranceCard({ insurance, onClick, index = 0 }: InsuranceCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const color = INSURANCE_TYPE_COLORS[insurance.type] || '#6366f1'

  return (
    <div
      className={cn(
        'group relative bg-white dark:bg-gray-800/80 rounded-2xl border shadow-sm overflow-hidden cursor-pointer',
        'hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-black/30 transition-all duration-500',
        'opacity-0 animate-fade-in',
        isHovered ? 'border-gray-300 dark:border-gray-600 -translate-y-0.5' : 'border-gray-100 dark:border-gray-700/50',
      )}
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'both' }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick?.() }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-1 transition-opacity duration-500"
        style={{ backgroundColor: color, opacity: isHovered ? 1 : 0.6 }}
      />

      <div className="relative p-5 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <InsuranceTypeBadge type={insurance.type} />
          <InsuranceStatusBadge status={insurance.status} />
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
            {insurance.name}
          </h3>
          {insurance.provider && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
              <FileText className="h-3 w-3" />
              {insurance.provider}
              {insurance.policy_number && ` - ${insurance.policy_number}`}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500">Prima</p>
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {formatCurrency(insurance.premium_amount)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500">Frecuencia</p>
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {FREQUENCY_LABELS[insurance.premium_frequency] || insurance.premium_frequency}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500">Cobertura</p>
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {insurance.coverage_amount ? formatCurrency(insurance.coverage_amount) : '-'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500">Polizas</p>
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {insurance.policies_count}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400">
          <CalendarClock className="h-3.5 w-3.5 shrink-0" />
          <span>
            {formatDate(insurance.start_date, 'long')}
            {insurance.end_date ? ` - ${formatDate(insurance.end_date, 'long')}` : ' - Actualidad'}
          </span>
        </div>
      </div>
    </div>
  )
}
