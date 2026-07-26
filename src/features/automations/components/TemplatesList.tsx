import {
  PiggyBank, CreditCard, Shield, Bell, Target, ArrowRight,
} from 'lucide-react'
import type { TriggerType, ActionType } from '@/types/automations'

interface TemplateDef {
  name: string
  description: string
  triggerType: TriggerType
  actionType: ActionType
  icon: typeof PiggyBank
  gradient: string
}

const TEMPLATES: TemplateDef[] = [
  {
    name: 'Ahorro al recibir ingreso',
    description: 'Transfiere automaticamente un porcentaje de tus ingresos a tu cuenta de ahorros.',
    triggerType: 'income_received',
    actionType: 'transfer',
    icon: PiggyBank,
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    name: 'Pago automatico de tarjeta',
    description: 'Programa el pago de tu tarjeta de credito cuando se acerque la fecha de vencimiento.',
    triggerType: 'bill_due_soon',
    actionType: 'pay_credit_card',
    icon: CreditCard,
    gradient: 'from-rose-500 to-pink-600',
  },
  {
    name: 'Proteger saldo minimo',
    description: 'Transfiere fondos para mantener un saldo minimo en tu cuenta principal.',
    triggerType: 'balance_threshold',
    actionType: 'transfer',
    icon: Shield,
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    name: 'Notificar presupuesto excedido',
    description: 'Recibe una notificacion cuando un presupuesto se acerque a su limite.',
    triggerType: 'budget_exceeded',
    actionType: 'notify',
    icon: Bell,
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    name: 'Celebrar meta completada',
    description: 'Recibe una notificacion para celebrar cuando completes una meta de ahorro.',
    triggerType: 'goal_completed',
    actionType: 'notify',
    icon: Target,
    gradient: 'from-purple-500 to-violet-600',
  },
]

interface TemplatesListProps {
  onSelect: (triggerType: TriggerType, actionType: ActionType) => void
}

export default function TemplatesList({ onSelect }: TemplatesListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {TEMPLATES.map((template, index) => {
        const Icon = template.icon
        return (
          <div
            key={template.name}
            className="group relative overflow-hidden rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-purple-200/50 dark:hover:border-purple-500/30 flex flex-col group-hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-transparent to-purple-500/0 group-hover:from-purple-500/[0.03] group-hover:to-purple-500/[0.03] transition-all duration-500" />
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${template.gradient} shadow-lg mb-3 relative group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1 relative group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors duration-300">
              {template.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 flex-1 relative">
              {template.description}
            </p>
            <button
              onClick={() => onSelect(template.triggerType, template.actionType)}
              className="relative inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-3 py-2 text-xs font-semibold shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.97] self-start group/btn"
            >
              Usar
              <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform duration-300" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
