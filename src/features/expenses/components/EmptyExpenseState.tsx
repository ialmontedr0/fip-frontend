import { ShoppingCart, Plus } from 'lucide-react'
import { Button } from '@/components/ui'
import { useNavigate } from 'react-router-dom'

interface Props {
  variant?: 'expenses' | 'templates' | 'services' | 'subscriptions' | 'cards' | 'bills' | 'duplicates' | 'recurring'
}

const VARIANTS = {
  expenses: { title: 'No hay gastos', desc: 'Crea tu primer gasto para empezar a trackear', link: '/expenses/new', label: 'Nuevo Gasto' },
  templates: { title: 'No hay plantillas', desc: 'Crea plantillas para gastos frecuentes', link: '/expenses/templates/new', label: 'Nueva Plantilla' },
  services: { title: 'No hay servicios', desc: 'Agrega tus servicios de utilities', link: '/expenses/services/new', label: 'Nuevo Servicio' },
  subscriptions: { title: 'No hay suscripciones', desc: 'Registra tus suscripciones activas', link: '/expenses/subscriptions/new', label: 'Nueva Suscripcion' },
  cards: { title: 'No hay tarjetas', desc: 'Agrega tus tarjetas de credito', link: '/expenses/credit-cards/new', label: 'Nueva Tarjeta' },
  bills: { title: 'No hay facturas', desc: 'Las facturas apareceran aqui cuando las generes', link: '#', label: '' },
  duplicates: { title: 'Sin duplicados', desc: 'No se detectaron gastos duplicados en los ultimos 30 dias', link: '#', label: '' },
  recurring: { title: 'Sin candidatos', desc: 'No se encontraron patrones recurrentes en tus gastos', link: '#', label: '' },
}

export default function EmptyExpenseState({ variant = 'expenses' }: Props) {
  const navigate = useNavigate()
  const v = VARIANTS[variant]
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
        <ShoppingCart className="h-8 w-8 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{v.title}</h3>
      <p className="mb-6 max-w-xs text-xs text-gray-500 dark:text-gray-400">{v.desc}</p>
      {v.link !== '#' && (
        <Button onClick={() => navigate(v.link)} className="rounded-xl gap-2">
          <Plus className="h-4 w-4" />
          {v.label}
        </Button>
      )}
    </div>
  )
}
