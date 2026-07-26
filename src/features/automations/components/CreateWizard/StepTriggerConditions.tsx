import type { TriggerType, TriggerConditions } from '@/types/automations'
import IncomeReceivedCondition from './ConditionBuilder/IncomeReceivedCondition'
import BalanceThresholdCondition from './ConditionBuilder/BalanceThresholdCondition'
import DateScheduledCondition from './ConditionBuilder/DateScheduledCondition'
import BillDueSoonCondition from './ConditionBuilder/BillDueSoonCondition'
import BudgetExceededCondition from './ConditionBuilder/BudgetExceededCondition'
import GoalCompletedCondition from './ConditionBuilder/GoalCompletedCondition'

interface StepTriggerConditionsProps {
  triggerType: TriggerType
  value: TriggerConditions | null
  onChange: (conditions: TriggerConditions) => void
}

export default function StepTriggerConditions({ triggerType, value, onChange }: StepTriggerConditionsProps) {
  return (
    <div className="rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm p-5 animate-fade-in-up">
      {(() => {
        switch (triggerType) {
          case 'income_received':
            return <IncomeReceivedCondition value={value as any} onChange={onChange} />
          case 'balance_threshold':
            return <BalanceThresholdCondition value={value as any} onChange={onChange} />
          case 'date_scheduled':
            return <DateScheduledCondition value={value as any} onChange={onChange} />
          case 'bill_due_soon':
            return <BillDueSoonCondition value={value as any} onChange={onChange} />
          case 'budget_exceeded':
            return <BudgetExceededCondition value={value as any} onChange={onChange} />
          case 'goal_completed':
            return <GoalCompletedCondition value={value as any} onChange={onChange} />
          default:
            return (
              <p className="text-sm text-gray-400 text-center py-8">
                Selecciona un tipo de disparador primero
              </p>
            )
        }
      })()}
    </div>
  )
}
