import { cn } from '@/lib/utils'
import { TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui'
import { useNavigate } from 'react-router-dom'

interface Props {
  type?: 'incomes' | 'sources' | 'schedule' | 'recurring' | 'irregular'
  className?: string
}

const EMPTY_MESSAGES = {
  incomes: {
    title: 'No hay ingresos registrados',
    description: 'Crea tu primer ingreso para empezar a trackear tus finanzas.',
    action: 'Crear Ingreso',
    link: '/incomes/new',
  },
  sources: {
    title: 'No hay fuentes de ingreso',
    description: 'Agrega tu empleador, cliente o negocio como fuente de ingreso.',
    action: 'Nueva Fuente',
    link: '/incomes/sources/new',
  },
  schedule: {
    title: 'No hay ingresos programados',
    description: 'Programa tu proximo ingreso para mantener un calendario financiero.',
    action: 'Nueva Programacion',
    link: '/incomes/schedule/new',
  },
  recurring: {
    title: 'No se detectaron patrones recurrentes',
    description: 'Los patrones apareceran automaticamente cuando tengas ingresos con regularidad.',
    action: 'Ver Ingresos',
    link: '/incomes',
  },
  irregular: {
    title: 'No se identificaron ingresos irregulares',
    description: 'Los ingresos irregulares se detectan automaticamente basado en desviaciones del promedio.',
    action: 'Ver Ingresos',
    link: '/incomes',
  },
}

export default function EmptyIncomeState({ type = 'incomes', className }: Props) {
  const navigate = useNavigate()
  const msg = EMPTY_MESSAGES[type]

  return (
    <div className={cn(
      'flex flex-col items-center justify-center py-16 px-4 text-center',
      'rounded-2xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-dashed border-gray-300 dark:border-gray-600',
      className,
    )}>
      <div className="mb-4 rounded-full bg-gray-100 dark:bg-gray-700/50 p-4">
        <TrendingUp className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">{msg.title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm">{msg.description}</p>
      <Button onClick={() => navigate(msg.link)} className="rounded-xl">
        {msg.action}
      </Button>
    </div>
  )
}
