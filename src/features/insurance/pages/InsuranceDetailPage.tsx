import { useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft, Edit3, RefreshCw, Plus, ShieldCheck, FileText,
  Coins, CalendarClock, Info, Layers, CreditCard, Building2, Hash,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import {
  useInsurance, useUpdateInsuranceStatus,
  useInsurancePolicies, useCreateInsurancePolicy, useDeleteInsurancePolicy,
  useInsurancePremiums, useMarkPremiumPaid, useDeleteInsurancePremium,
} from '../hooks/useInsurance'
import InsuranceTypeBadge from '../components/InsuranceTypeBadge'
import InsuranceStatusBadge from '../components/InsuranceStatusBadge'
import PolicyCard from '../components/PolicyCard'
import PolicyForm from '../components/PolicyForm'
import PremiumCard from '../components/PremiumCard'
import { FREQUENCY_LABELS } from '../constants'
import { INSURANCE_STATUSES } from '@/types/insurance'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

type Tab = 'overview' | 'policies' | 'premiums'

function StatCard({ icon: Icon, label, value, color, sub }: { icon: React.ElementType; label: string; value: React.ReactNode; color?: string; sub?: string }) {
  return (
    <div className="bg-white dark:bg-gray-800/80 rounded-xl border border-gray-100 dark:border-gray-700/50 p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      <div className="flex items-center gap-2 mb-1.5">
        <Icon className={cn('h-4 w-4', color || 'text-gray-400')} />
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      </div>
      <p className={cn('text-lg font-bold', color || 'text-gray-900 dark:text-gray-100')}>{value}</p>
      {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}

function TabButton({ tab, active, label, icon: Icon }: { tab: Tab; active: Tab; label: string; icon: React.ElementType }) {
  return (
    <button
      type="button"
      className={cn(
        'flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 whitespace-nowrap',
        active === tab
          ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25'
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50',
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}

export default function InsuranceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = (searchParams.get('tab') as Tab) || 'overview'

  const [policyFormOpen, setPolicyFormOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState('')
  const [deletePolicyId, setDeletePolicyId] = useState<string | null>(null)
  const [deletePremiumId, setDeletePremiumId] = useState<string | null>(null)

  const { data: insurance, isLoading } = useInsurance(id!)
  const updateStatusMutation = useUpdateInsuranceStatus()

  const { data: policiesData } = useInsurancePolicies(id!)
  const createPolicyMutation = useCreateInsurancePolicy(id!)
  const deletePolicyMutation = useDeleteInsurancePolicy(id!)

  const { data: premiumsData } = useInsurancePremiums(id!, statusFilter ? { status: statusFilter } : undefined)
  const markPremiumPaidMutation = useMarkPremiumPaid(id!)
  const deletePremiumMutation = useDeleteInsurancePremium(id!)

  const setTab = (tab: Tab) => {
    setSearchParams({ tab }, { replace: true })
  }

  const handleToggleStatus = async () => {
    if (!insurance) return
    const newStatus = insurance.status === 'active' ? 'cancelled' : 'active'
    try {
      await updateStatusMutation.mutateAsync({ id: id!, data: { status: newStatus } })
      toast.success('Estado del seguro actualizado')
    } catch (err: any) {
      toast.error(err?.message || 'Error al actualizar el estado')
    }
  }

  const handleMarkPaid = async (premiumId: string) => {
    try {
      await markPremiumPaidMutation.mutateAsync({ premiumId, data: { paid_date: new Date().toISOString().split('T')[0] } })
      toast.success('Prima marcada como pagada')
    } catch (err: any) {
      toast.error(err?.message || 'Error al marcar la prima')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!insurance) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <ShieldCheck className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Seguro no encontrado</h2>
        <button type="button" onClick={() => navigate('/insurance')} className="mt-4 text-sm text-emerald-500 hover:underline">
          Volver a seguros
        </button>
      </div>
    )
  }

  const policies = insurance.policies || policiesData?.policies || []
  const premiums = premiumsData?.premiums || []

  return (
    <div className="relative space-y-6 pb-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-emerald-500/5 blur-3xl dark:bg-emerald-500/10" />
        <div className="absolute -right-40 top-60 h-80 w-80 rounded-full bg-teal-500/5 blur-3xl dark:bg-teal-500/10" />
      </div>

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/insurance')}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            title="Volver"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[200px] sm:max-w-none">{insurance.name}</h2>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => navigate(`/insurance/${id}/edit`)}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="Editar"
          >
            <Edit3 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="h-7 w-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{insurance.name}</h1>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <InsuranceTypeBadge type={insurance.type} />
                <InsuranceStatusBadge status={insurance.status} />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => navigate(`/insurance/${id}/edit`)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all duration-200"
            >
              <Edit3 className="h-4 w-4" />
              Editar
            </button>
            <button
              type="button"
              onClick={handleToggleStatus}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              {insurance.status === 'active' ? 'Cancelar' : 'Activar'}
            </button>
          </div>
        </div>
      </div>

      <div className="relative flex flex-wrap items-center gap-2 border-b border-gray-100 dark:border-gray-700/50 pb-3 overflow-x-auto">
        <TabButton tab="overview" active={activeTab} label="Resumen" icon={Info} />
        <TabButton tab="policies" active={activeTab} label="Polizas" icon={Layers} />
        <TabButton tab="premiums" active={activeTab} label="Primas" icon={CreditCard} />
      </div>

      {activeTab === 'overview' && (
        <div className="animate-fade-in space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <StatCard icon={ShieldCheck} label="Tipo" value={INSURANCE_STATUSES[insurance.status] || insurance.status} color="text-gray-900 dark:text-gray-100" />
            <StatCard icon={Coins} label="Cobertura" value={insurance.coverage_amount ? formatCurrency(insurance.coverage_amount) : '-'} color="text-emerald-600 dark:text-emerald-400" />
            <StatCard icon={CreditCard} label="Prima" value={formatCurrency(insurance.premium_amount)} color="text-blue-600 dark:text-blue-400" />
            <StatCard icon={CalendarClock} label="Frecuencia" value={FREQUENCY_LABELS[insurance.premium_frequency] || insurance.premium_frequency} color="text-violet-600 dark:text-violet-400" />
            <StatCard icon={Layers} label="Polizas" value={insurance.policies.length} color="text-gray-900 dark:text-gray-100" />
            <StatCard icon={CreditCard} label="Primas" value={insurance.premiums_count} color="text-gray-900 dark:text-gray-100" />
          </div>

          <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Informacion General</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-gray-400 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Proveedor</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{insurance.provider || '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Hash className="h-4 w-4 text-gray-400 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Numero de Poliza</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{insurance.policy_number || '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CalendarClock className="h-4 w-4 text-gray-400 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Vigencia</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {formatDate(insurance.start_date, 'long')}
                    {insurance.end_date ? ` - ${formatDate(insurance.end_date, 'long')}` : ' - Actualidad'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Coins className="h-4 w-4 text-gray-400 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Cobertura</p>
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    {insurance.coverage_amount ? formatCurrency(insurance.coverage_amount) : '—'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {insurance.notes && (
            <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-400" />
                Notas
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{insurance.notes}</p>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setTab('policies')}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              Ver Polizas
            </button>
            <button
              type="button"
              onClick={() => navigate(`/insurance/${id}/premiums/new`)}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25 transition-all duration-200"
            >
              <CreditCard className="h-4 w-4" />
              Agregar Prima
            </button>
          </div>
        </div>
      )}

      {activeTab === 'policies' && (
        <div className="animate-fade-in space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Polizas del Seguro</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{policies.length} poliza{policies.length !== 1 ? 's' : ''}</p>
            </div>
            <button
              type="button"
              onClick={() => setPolicyFormOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25 transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              Nueva Poliza
            </button>
          </div>

          {policies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {policies.map((policy, idx) => (
                <PolicyCard
                  key={policy.id}
                  policy={policy}
                  index={idx}
                  onDelete={() => setDeletePolicyId(policy.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
              <Layers className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No hay polizas aun</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">Agrega polizas para detallar la cobertura de este seguro</p>
              <button
                type="button"
                onClick={() => setPolicyFormOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25 transition-all duration-200"
              >
                <Plus className="h-4 w-4" />
                Nueva Poliza
              </button>
            </div>
          )}

          <PolicyForm
            open={policyFormOpen}
            onClose={() => setPolicyFormOpen(false)}
            isPending={createPolicyMutation.isPending}
            onSubmit={async (data) => {
              try {
                await createPolicyMutation.mutateAsync(data)
                toast.success('Poliza creada exitosamente')
                setPolicyFormOpen(false)
              } catch (err: any) {
                toast.error(err?.message || 'Error al crear la poliza')
                throw err
              }
            }}
          />

          <ConfirmDialog
            open={!!deletePolicyId}
            onClose={() => setDeletePolicyId(null)}
            onConfirm={async () => {
              if (!deletePolicyId) return
              try {
                await deletePolicyMutation.mutateAsync(deletePolicyId)
                toast.success('Poliza eliminada')
                setDeletePolicyId(null)
              } catch (err: any) {
                toast.error(err?.message || 'Error al eliminar la poliza')
              }
            }}
            title="Eliminar Poliza"
            message="Esta accion eliminara esta poliza de forma permanente."
            confirmLabel="Eliminar"
            destructive
            isLoading={deletePolicyMutation.isPending}
          />
        </div>
      )}

      {activeTab === 'premiums' && (
        <div className="animate-fade-in space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Primas</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {premiums.length} prima{premiums.length !== 1 ? 's' : ''}
                {premiumsData?.total_pending_amount != null && premiumsData.total_pending_amount > 0 && (
                  <span className="text-red-500 font-medium ml-1">
                    - Pendiente: {formatCurrency(premiumsData.total_pending_amount)}
                  </span>
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate(`/insurance/${id}/premiums/new`)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25 transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              Nueva Prima
            </button>
          </div>

          <div className="flex items-center gap-2">
            {(['', 'pending', 'paid', 'overdue'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  statusFilter === status
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
                )}
              >
                {status === '' ? 'Todas' : status === 'paid' ? 'Pagadas' : status === 'pending' ? 'Pendientes' : 'Vencidas'}
              </button>
            ))}
          </div>

          {premiums.length > 0 ? (
            <div className="space-y-3">
              {premiums.map((premium, idx) => (
                <PremiumCard
                  key={premium.id}
                  premium={premium}
                  index={idx}
                  onMarkPaid={premium.status === 'pending' || premium.status === 'overdue' ? () => handleMarkPaid(premium.id) : undefined}
                  onDelete={() => setDeletePremiumId(premium.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
              <CreditCard className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {statusFilter ? `No hay primas ${statusFilter === 'paid' ? 'pagadas' : statusFilter === 'pending' ? 'pendientes' : 'vencidas'}` : 'No hay primas aun'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">Agrega primas para dar seguimiento a los pagos de este seguro</p>
              <button
                type="button"
                onClick={() => navigate(`/insurance/${id}/premiums/new`)}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25 transition-all duration-200"
              >
                <Plus className="h-4 w-4" />
                Nueva Prima
              </button>
            </div>
          )}

          <ConfirmDialog
            open={!!deletePremiumId}
            onClose={() => setDeletePremiumId(null)}
            onConfirm={async () => {
              if (!deletePremiumId) return
              try {
                await deletePremiumMutation.mutateAsync(deletePremiumId)
                toast.success('Prima eliminada')
                setDeletePremiumId(null)
              } catch (err: any) {
                toast.error(err?.message || 'Error al eliminar la prima')
              }
            }}
            title="Eliminar Prima"
            message="Esta accion eliminara esta prima de forma permanente."
            confirmLabel="Eliminar"
            destructive
            isLoading={deletePremiumMutation.isPending}
          />
        </div>
      )}
    </div>
  )
}
