import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../hooks/useOnboarding'
import { ONBOARDING_STEPS } from '../constants'
import { Button, Card, CardContent } from '@/components/ui'
import { ArrowRight, ArrowLeft, X, PlusCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

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

  const stepIndex = ONBOARDING_STEPS.findIndex((s) => s.id === currentStep)
  const step = ONBOARDING_STEPS[stepIndex]
  if (!step) return null

  const isFirstStep = stepIndex === 0
  const isLastStep = stepIndex === ONBOARDING_STEPS.length - 1

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
          <ProgressBar current={stepIndex} total={ONBOARDING_STEPS.length} />

          {/* Icon */}
          <div className="mt-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gray-50 to-gray-100 text-4xl dark:from-gray-800 dark:to-gray-700">
              {step.emoji}
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

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3">
            <Button
              onClick={() => {
                navigate(step.target)
                if (isLastStep) {
                  nextStep()
                } else {
                  nextStep()
                }
              }}
              className="w-full"
              size="lg"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              {isLastStep ? 'Empezar' : 'Ir a ' + step.title.split(' ')[0].toLowerCase()}
            </Button>

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

              <Button
                onClick={nextStep}
                variant={isFirstStep ? undefined : 'outline'}
                className="flex-1"
              >
                {isLastStep ? 'Finalizar' : 'Omitir paso'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Step counter */}
          <p className="mt-4 text-center text-xs text-gray-400 dark:text-gray-500">
            Paso {stepIndex + 1} de {ONBOARDING_STEPS.length}
            {completedSteps.length > 0 && ` · ${completedSteps.length} completado${completedSteps.length > 1 ? 's' : ''}`}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
