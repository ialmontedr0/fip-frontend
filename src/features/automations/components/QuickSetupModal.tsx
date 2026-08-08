import { useState, useEffect, useCallback } from 'react'
import { X, PiggyBank, CreditCard, ArrowLeftRight, Wallet, DollarSign, Percent, Calendar } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import { useAccounts } from '@/features/accounts/hooks/useAccounts'

type Tab = 'savings' | 'card' | 'balance'

const TABS: { key: Tab; label: string; icon: typeof PiggyBank }[] = [
  { key: 'savings', label: 'Ahorro automatico', icon: PiggyBank },
  { key: 'card', label: 'Pago tarjeta', icon: CreditCard },
  { key: 'balance', label: 'Transferencia por saldo', icon: ArrowLeftRight },
]

interface QuickSetupModalProps {
  open: boolean
  onClose: () => void
}

function AccountSelect({ value, onChange, label, icon: Icon }: { value: string; onChange: (v: string) => void; label: string; icon?: typeof Wallet }) {
  const { data, isLoading } = useAccounts()
  const accounts = data?.accounts

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
        {Icon && <Icon className="h-3 w-3 text-gray-400" />}
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/30 appearance-none transition-all duration-200 hover:border-purple-200/50 dark:hover:border-purple-500/30 shadow-sm"
        >
          <option value="">Seleccionar cuenta</option>
          {isLoading ? (
            <option disabled>Cargando...</option>
          ) : (
            accounts?.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name} ({acc.balance ? formatCurrency(acc.balance) : ''})
              </option>
            ))
          )}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
      </div>
    </div>
  )
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
    </svg>
  )
}

function SavingsTab() {
  const [sourceAccount, setSourceAccount] = useState('')
  const [targetAccount, setTargetAccount] = useState('')
  const [amount, setAmount] = useState('')
  const [amountType, setAmountType] = useState('fixed')

  const handleSetup = () => {
    // quick savings setup mutation call
  }

  return (
    <div className="space-y-4 animate-fade-in-up">
      <AccountSelect value={sourceAccount} onChange={setSourceAccount} label="Cuenta origen" icon={Wallet} />
      <AccountSelect value={targetAccount} onChange={setTargetAccount} label="Cuenta destino" icon={Wallet} />
      <div className="rounded-xl border border-gray-100/80 dark:border-gray-700/80 bg-white/50 dark:bg-gray-800/30 p-4 space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
            <DollarSign className="h-3 w-3 text-gray-400" />
            Monto
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 pl-9 pr-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 hover:border-purple-200/50 dark:hover:border-purple-500/30 shadow-sm"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
            <Percent className="h-3 w-3 text-gray-400" />
            Tipo de monto
          </label>
          <div className="relative">
            <select
              value={amountType}
              onChange={(e) => setAmountType(e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/30 appearance-none transition-all duration-200 hover:border-purple-200/50 dark:hover:border-purple-500/30 shadow-sm"
            >
              <option value="fixed">Fijo</option>
              <option value="percent_of_balance">Porcentaje del saldo</option>
              <option value="percent_of_surplus">Porcentaje del excedente</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
      <button
        onClick={handleSetup}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2.5 text-sm font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.97]"
      >
        Configurar
      </button>
    </div>
  )
}

function CardTab() {
  const [cardId, setCardId] = useState('')
  const [paymentAccountId, setPaymentAccountId] = useState('')
  const [paymentType, setPaymentType] = useState('minimum')
  const [daysBeforeDue, setDaysBeforeDue] = useState('3')

  const handleSetup = () => {
    // quick card payment setup mutation call
  }

  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="rounded-xl border border-gray-100/80 dark:border-gray-700/80 bg-white/50 dark:bg-gray-800/30 p-4 space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
            <CreditCard className="h-3 w-3 text-gray-400" />
            Tarjeta
          </label>
          <div className="relative">
            <select
              value={cardId}
              onChange={(e) => setCardId(e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/30 appearance-none transition-all duration-200 hover:border-purple-200/50 dark:hover:border-purple-500/30 shadow-sm"
            >
              <option value="">Seleccionar tarjeta</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <AccountSelect value={paymentAccountId} onChange={setPaymentAccountId} label="Cuenta de pago" icon={Wallet} />
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
            <DollarSign className="h-3 w-3 text-gray-400" />
            Tipo de pago
          </label>
          <div className="relative">
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/30 appearance-none transition-all duration-200 hover:border-purple-200/50 dark:hover:border-purple-500/30 shadow-sm"
            >
              <option value="minimum">Minimo</option>
              <option value="full">Completo</option>
              <option value="custom">Personalizado</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
            <Calendar className="h-3 w-3 text-gray-400" />
            Dias antes del vencimiento
          </label>
          <input
            type="number"
            value={daysBeforeDue}
            onChange={(e) => setDaysBeforeDue(e.target.value)}
            min={1}
            max={30}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 hover:border-purple-200/50 dark:hover:border-purple-500/30 shadow-sm"
          />
        </div>
      </div>
      <button
        onClick={handleSetup}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white px-4 py-2.5 text-sm font-semibold shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/30 hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.97]"
      >
        Configurar
      </button>
    </div>
  )
}

function BalanceTab() {
  const [source, setSource] = useState('')
  const [target, setTarget] = useState('')
  const [threshold, setThreshold] = useState('')
  const [direction, setDirection] = useState('below')
  const [percent, setPercent] = useState('20')

  const handleSetup = () => {
    // quick balance transfer setup mutation call
  }

  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="rounded-xl border border-gray-100/80 dark:border-gray-700/80 bg-white/50 dark:bg-gray-800/30 p-4 space-y-4">
        <AccountSelect value={source} onChange={setSource} label="Cuenta origen" icon={Wallet} />
        <AccountSelect value={target} onChange={setTarget} label="Cuenta destino" icon={Wallet} />
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
            <DollarSign className="h-3 w-3 text-gray-400" />
            Saldo minimo
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 pl-9 pr-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 hover:border-purple-200/50 dark:hover:border-purple-500/30 shadow-sm"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
            <ArrowLeftRight className="h-3 w-3 text-gray-400" />
            Direccion
          </label>
          <div className="relative">
            <select
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/30 appearance-none transition-all duration-200 hover:border-purple-200/50 dark:hover:border-purple-500/30 shadow-sm"
            >
              <option value="below">Por debajo del umbral</option>
              <option value="above">Por encima del umbral</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
            <Percent className="h-3 w-3 text-gray-400" />
            Porcentaje a transferir
          </label>
          <div className="relative">
            <input
              type="number"
              value={percent}
              onChange={(e) => setPercent(e.target.value)}
              min={1}
              max={100}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 hover:border-purple-200/50 dark:hover:border-purple-500/30 shadow-sm"
            />
          </div>
        </div>
      </div>
      <button
        onClick={handleSetup}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2.5 text-sm font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.97]"
      >
        Configurar
      </button>
    </div>
  )
}

export default function QuickSetupModal({ open, onClose }: QuickSetupModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('savings')

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [open, handleEscape])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-50 w-full max-w-lg mx-4 rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl shadow-2xl animate-in zoom-in-95 duration-300"
      >
        <div className="flex items-center justify-between p-5 pb-3 border-b border-gray-100/50 dark:border-gray-700/50">
          <h2 className="text-base font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Configuracion rapida
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all hover:scale-110 active:scale-90"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        <div className="px-5 pb-3 pt-4">
          <div className="flex rounded-xl bg-gray-100 dark:bg-gray-800/80 p-1 gap-0.5 shadow-inner">
            {TABS.map((tab) => {
              const TabIcon = tab.icon
              const active = activeTab === tab.key
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    'relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all flex-1 justify-center',
                    active
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
                  )}
                >
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500" />
                  )}
                  <TabIcon className={cn('h-3.5 w-3.5', active && 'text-purple-600 dark:text-purple-400')} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="px-5 pb-5">
          {activeTab === 'savings' && <SavingsTab key="savings" />}
          {activeTab === 'card' && <CardTab key="card" />}
          {activeTab === 'balance' && <BalanceTab key="balance" />}
        </div>
      </div>
    </div>
  )
}
