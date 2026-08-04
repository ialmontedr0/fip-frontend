import { useNavigate } from 'react-router-dom'
import { useOnboarding, type OnboardingStep } from '../hooks/useOnboarding'
import { Button, Card, CardContent } from '@/components/ui'
import {
  Wallet,
  ArrowRight,
  ArrowLeft,
  X,
  PlusCircle,
  Receipt,
  Tags,
  CheckCircle2,
  Rocket,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const STEPS: Array<{
  key: OnboardingStep
  title: string
  description: string
  icon: React.ReactNode
  actionLabel?: string
  actionTo?: string
}> = [
  {
    key: 'welcome',
    title: 'Bienvenido a FIP',
    description: 'Tu plataforma de inteligencia financiera. Te guiaremos para sacarle el maximo provecho.',
    icon: <Rocket className="h-8 w-8 text-primary-500" />,
  },
  {
    key: 'create_account',
    title: 'Crea tu primera cuenta',
    description: 'Las cuentas representan tus bancos, efectivo, tarjetas o billeteras. Necesitas al menos una para empezar.',
    icon: <Wallet className="h-8 w-8 text-emerald-500" />,
    actionLabel: 'Crear Cuenta',
    actionTo: '/accounts/new',
  },
  {
    key: 'first_transaction',
    title: 'Registra tu primer gasto',
    description: 'Las transacciones son el corazon de la plataforma. Registra un gasto o ingreso para ver tus reportes.',
    icon: <Receipt className="h-8 w-8 text-amber-500" />,
    actionLabel: 'Nueva Transaccion',
    actionTo: '/transactions/new',
  },
  {
    key: 'explore_categories',
    title: 'Explora las categorias',
    description: 'Organiza tus finanzas con categorias como Alimentacion, Transporte, Salud y mas.',
    icon: <Tags className="h-8 w-8 text-violet-500" />,
    actionLabel: 'Ver Categorias',
    actionTo: '/categories',
  },
]

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-1.5" role="progressbar" aria-valuenow={current} aria-valuemin={0} aria-valuemax={total}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-1.5 flex-1 rounded-full transition-all duration-300',
            i < current
              ? 'bg-primary-500'
              : i === current
                ? 'bg-primary-300 dark:bg-primary-600'
                : 'bg-gray-200 dark:bg-gray-700',
          )}
        />
      ))}
    </div>
  )
}

export default function OnboardingFlow() {
  const navigate = useNavigate()
  const { currentStep, isCompleted, isDismissed, nextStep, prevStep, skip, completedSteps } = useOnboarding()

  if (isCompleted || isDismissed) return null

  const stepIndex = STEPS.findIndex((s) => s.key === currentStep)
  const step = STEPS[stepIndex]
  if (!step) return null

  const isFirstStep = stepIndex === 0
  const isLastStep = stepIndex === STEPS.length - 1

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" role="dialog" aria-modal="true" aria-label="Onboarding">
      <Card className="relative w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Close / Skip */}
        <button
          onClick={skip}
          className="absolute right-3 top-3 z-10 rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          aria-label="Saltar onboarding"
        >
          <X className="h-4 w-4" />
        </button>

        <CardContent className="p-8">
          {/* Progress */}
          <ProgressBar current={stepIndex} total={STEPS.length} />

          {/* Icon */}
          <div className="mt-6 flex justify-center">
            <div className="rounded-full bg-gradient-to-br from-gray-50 to-gray-100 p-4 dark:from-gray-800 dark:to-gray-700">
              {step.icon}
            </div>
          </div>

          {/* Content */}
          <div className="mt-5 text-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {step.title}
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* Done state */}
          {currentStep === 'done' && (
            <div className="mt-4 flex justify-center">
              <CheckCircle2 className="h-12 w-12 text-emerald-500" />
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3">
            {step.actionLabel && step.actionTo && (
              <Button
                onClick={() => navigate(step.actionTo!)}
                className="w-full"
                size="lg"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                {step.actionLabel}
              </Button>
            )}

            <div className="flex gap-3">
              {!isFirstStep && (
                <Button
                  variant="outline"
                  onClick={prevStep}
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Atras
                </Button>
              )}

              {isLastStep ? (
                <Button
                  onClick={() => {
                    nextStep()
                    navigate('/dashboard')
                  }}
                  className="flex-1"
                >
                  Ir al Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  variant={step.actionLabel ? 'outline' : undefined}
                  className="flex-1"
                >
                  {step.actionLabel ? 'Siguiente' : 'Continuar'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Step counter */}
          <p className="mt-4 text-center text-xs text-gray-400 dark:text-gray-500">
            Paso {stepIndex + 1} de {STEPS.length}
            {completedSteps.length > 0 && ` · ${completedSteps.length} completado${completedSteps.length > 1 ? 's' : ''}`}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
