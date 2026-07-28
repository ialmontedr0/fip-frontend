import { useParams, useNavigate } from 'react-router-dom'
import { formatCurrency } from '@/lib/utils'
import { Button, Card, CardContent, Skeleton } from '@/components/ui'
import { useIncome, useDeleteIncome } from '../hooks/useIncomes'
import { useAccount } from '@/features/accounts/hooks/useAccounts'
import { useCategory } from '@/features/categories/hooks/useCategories'
import IncomeTypeBadge from '../components/IncomeTypeBadge'
import IncomeStatusBadge from '../components/IncomeStatusBadge'
import StabilityBadge from '../components/StabilityBadge'
import { ArrowLeft, Edit3, Trash2, ExternalLink, Calendar, Building2, Hash, FileText, Briefcase, Receipt, TrendingUp } from 'lucide-react'
import { INCOME_TYPE_CONFIG } from '../constants'
import type { LucideIcon } from 'lucide-react'

export default function IncomeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: income, isLoading, isError, refetch } = useIncome(id)
  const deleteMutation = useDeleteIncome()

  const { data: accountData } = useAccount(income?.account_id || undefined)
  const { data: categoryData } = useCategory(income?.category_id || undefined)

  const handleDelete = () => {
    if (!income) return
    if (window.confirm(`Eliminar ingreso: ${income.description}?`)) {
      deleteMutation.mutate(income.id, {
        onSuccess: () => navigate('/incomes'),
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    )
  }

  if (isError || !income) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-red-500 mb-2">Error al cargar el ingreso</p>
        <Button variant="outline" onClick={() => refetch()} className="rounded-xl">Reintentar</Button>
      </div>
    )
  }

  const typeConfig = income ? INCOME_TYPE_CONFIG[income.income_type as keyof typeof INCOME_TYPE_CONFIG] : null
  const TypeIcon = typeConfig?.icon as LucideIcon | undefined

  const accountDisplay = accountData
    ? `${accountData.name}${accountData.account_number_last4 ? ' ····' + accountData.account_number_last4 : ''}`
    : income?.account_id || '—'
  const categoryDisplay = categoryData?.name || income?.category_id || 'Sin categoria'
  const transactionDisplay = income?.transaction_id ? `#${income.transaction_id.slice(0, 8)}` : '—'

  const detailItems = [
    { label: 'Cuenta', value: accountDisplay, icon: Building2 },
    { label: 'Fecha Efectiva', value: income.effective_date ? new Date(income.effective_date).toLocaleDateString('es-DO', { day: 'numeric', month: 'long', year: 'numeric' }) : '-', icon: Calendar },
    { label: 'Categoria', value: categoryDisplay, icon: Hash },
    { label: 'Fuente', value: income.income_source_name || 'Sin fuente', icon: TrendingUp },
    { label: 'Frecuencia', value: income.frequency || 'No recurrente', icon: RepeatIcon },
    { label: 'Transaccion', value: transactionDisplay, icon: FileText },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-6 text-white">
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/incomes')}
              className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold truncate flex-1">{income.description}</h1>
            <IncomeStatusBadge status={income.income_status} />
          </div>
          <div className="flex items-center gap-2">
            {TypeIcon && <TypeIcon className="h-5 w-5 text-white/80" />}
            <span className="text-3xl font-bold">{formatCurrency(income.amount, income.currency_code)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => navigate(`/incomes/${id}/edit`)} className="rounded-xl">
          <Edit3 className="h-4 w-4 mr-2" />
          Editar
        </Button>
        <Button variant="outline" onClick={handleDelete} className="rounded-xl text-red-500 hover:text-red-600">
          <Trash2 className="h-4 w-4 mr-2" />
          Eliminar
        </Button>
        <Button variant="ghost" onClick={() => navigate(`/transactions/${income.transaction_id}`)} className="rounded-xl ml-auto">
          <ExternalLink className="h-4 w-4 mr-2" />
          Ver Transaccion
        </Button>
      </div>

      {/* Badges Row */}
      <div className="flex flex-wrap items-center gap-2">
        <IncomeTypeBadge type={income.income_type} />
        <StabilityBadge stability={income.stability} />
        {income.tags?.map((tag) => (
          <span key={tag} className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700/50 px-2.5 py-1 text-xs font-medium text-gray-600 dark:text-gray-300">
            {tag}
          </span>
        ))}
      </div>

      {/* Detail Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {detailItems.map((item) => (
          <Card key={item.label} className="border-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <item.icon className="h-4 w-4 text-gray-400" />
                <p className="text-[11px] font-medium text-gray-400 uppercase">{item.label}</p>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tax info */}
      {(income.gross_amount || income.tax_withheld || income.net_amount) && (
        <Card className="border-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl">
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <Receipt className="h-4 w-4 text-gray-400" />
              Informacion Fiscal
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {income.gross_amount && (
                <div>
                  <p className="text-[11px] font-medium text-gray-400 uppercase">Gross</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{formatCurrency(income.gross_amount)}</p>
                </div>
              )}
              {income.tax_withheld && (
                <div>
                  <p className="text-[11px] font-medium text-gray-400 uppercase">Tax</p>
                  <p className="text-sm font-bold text-red-600">{formatCurrency(income.tax_withheld)}</p>
                </div>
              )}
              {income.net_amount && (
                <div>
                  <p className="text-[11px] font-medium text-gray-400 uppercase">Neto</p>
                  <p className="text-sm font-bold text-emerald-600">{formatCurrency(income.net_amount)}</p>
                </div>
              )}
            </div>
            {income.employer_name && (
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50">
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-500">Empleador:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{income.employer_name}</span>
                  {income.employer_tax_id && (
                    <span className="text-gray-400">({income.employer_tax_id})</span>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {income.notes && (
        <Card className="border-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl">
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Notas</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{income.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function RepeatIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  )
}
