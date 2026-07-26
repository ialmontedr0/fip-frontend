import { useNavigate } from 'react-router-dom'
import { useCreateAccount } from '../hooks/useAccounts'
import AccountForm, { type AccountFormData } from '../components/AccountForm'
import { ArrowLeft } from 'lucide-react'

export default function AccountCreatePage() {
  const navigate = useNavigate()
  const createAccount = useCreateAccount()

  const handleSubmit = async (data: AccountFormData) => {
    const result = await createAccount.mutateAsync({
      name: data.name,
      account_type: data.account_type,
      currency_code: data.currency_code,
      initial_balance: data.initial_balance ? parseFloat(data.initial_balance) : 0,
      institution: data.institution || null,
      account_number_last4: data.account_number_last4 || null,
      icon: null,
      color: data.color || null,
      notes: data.notes || null,
      include_in_net_worth: data.include_in_net_worth,
      include_in_totals: data.include_in_totals,
    })
    navigate(`/accounts/${result.data.id}`)
  }

  return (
    <div className="relative max-w-2xl mx-auto pb-8">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-primary-200/20 to-purple-200/10 blur-3xl dark:from-primary-500/10 dark:to-purple-500/5" />

      <div className="flex items-center gap-3 mb-6 animate-fade-in">
        <button onClick={() => navigate('/accounts')} className="rounded-xl p-2.5 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-2.5 w-2.5 rounded-full bg-primary-500 shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
              <div className="absolute -inset-1 animate-ping rounded-full bg-primary-400/30" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Nueva Cuenta
            </h1>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 ml-5">
            Agrega una nueva cuenta financiera
          </p>
        </div>
      </div>

      <div
        className="relative overflow-hidden rounded-2xl border border-gray-100/80 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-gray-800/80 dark:bg-gray-900/80 animate-fade-in"
        style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
      >
        {/* Gradient accent bar */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-400 via-purple-400 to-primary-400" />
        <div className="relative">
          <AccountForm
            onSubmit={handleSubmit}
            isSubmitting={createAccount.isPending}
            mode="create"
          />
        </div>
      </div>
    </div>
  )
}
