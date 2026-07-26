import type { ActionType, ActionParams } from '@/types/automations'
import TransferActionParams from './ActionParamBuilder/TransferActionParams'
import PayCreditCardActionParams from './ActionParamBuilder/PayCreditCardActionParams'
import CreateTransactionActionParams from './ActionParamBuilder/CreateTransactionActionParams'
import NotifyActionParams from './ActionParamBuilder/NotifyActionParams'
import AdjustBudgetActionParams from './ActionParamBuilder/AdjustBudgetActionParams'

interface StepActionParamsProps {
  actionType: ActionType
  value: ActionParams | null
  onChange: (params: ActionParams) => void
}

export default function StepActionParams({ actionType, value, onChange }: StepActionParamsProps) {
  return (
    <div className="rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm p-5 animate-fade-in-up">
      {(() => {
        switch (actionType) {
          case 'transfer':
            return <TransferActionParams value={value as any} onChange={onChange} />
          case 'pay_credit_card':
            return <PayCreditCardActionParams value={value as any} onChange={onChange} />
          case 'create_transaction':
            return <CreateTransactionActionParams value={value as any} onChange={onChange} />
          case 'notify':
            return <NotifyActionParams value={value as any} onChange={onChange} />
          case 'adjust_budget':
            return <AdjustBudgetActionParams value={value as any} onChange={onChange} />
          default:
            return (
              <p className="text-sm text-gray-400 text-center py-8">
                Selecciona un tipo de acción primero
              </p>
            )
        }
      })()}
    </div>
  )
}
