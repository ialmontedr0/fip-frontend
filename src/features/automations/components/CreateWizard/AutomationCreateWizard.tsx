import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { WIZARD_STEPS } from '../../constants'
import { useCreateRule } from '../../hooks/useRules'
import type { TriggerType, TriggerConditions, ActionType, ActionParams } from '@/types/automations'
import StepIndicator from './StepIndicator'
import StepTriggerType from './StepTriggerType'
import StepTriggerConditions from './StepTriggerConditions'
import StepActionType from './StepActionType'
import StepActionParams from './StepActionParams'
import StepReview from './StepReview'

export default function AutomationCreateWizard() {
  const navigate = useNavigate()
  const createMutation = useCreateRule()

  const [step, setStep] = useState(1)
  const [selectedTrigger, setSelectedTrigger] = useState<TriggerType | null>(null)
  const [triggerConditions, setTriggerConditions] = useState<TriggerConditions | null>(null)
  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null)
  const [actionParams, setActionParams] = useState<ActionParams | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [maxExecutions, setMaxExecutions] = useState<number | null>(null)
  const [minBalance, setMinBalance] = useState<number | null>(null)
  const [animDir, setAnimDir] = useState<'forward' | 'backward'>('forward')
  const [transitioning, setTransitioning] = useState(false)

  const handleNext = () => {
    setAnimDir('forward')
    setTransitioning(true)
    setTimeout(() => {
      setStep(step + 1)
      setTransitioning(false)
    }, 150)
  }
  const handleBack = () => {
    if (step === 1) {
      navigate('/automations')
    } else {
      setAnimDir('backward')
      setTransitioning(true)
      setTimeout(() => {
        setStep(step - 1)
        setTransitioning(false)
      }, 150)
    }
  }

  const canNext = () => {
    if (step === 1) return selectedTrigger != null
    if (step === 2) return triggerConditions != null
    if (step === 3) return selectedAction != null
    if (step === 4) return actionParams != null
    return true
  }

  const handleCreate = async () => {
    if (!selectedTrigger || !selectedAction) return
    await createMutation.mutateAsync({
      name,
      description: description || undefined,
      trigger_type: selectedTrigger,
      trigger_conditions: triggerConditions ?? undefined,
      action_type: selectedAction,
      action_params: actionParams ?? undefined,
      max_executions_per_month: maxExecutions ?? undefined,
      min_balance_required: minBalance ?? undefined,
    })
    navigate('/automations')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <StepIndicator currentStep={step} />

      <div className="relative min-h-[380px]">
        <div
          className={`transition-all duration-300 ease-out ${
            transitioning
              ? animDir === 'forward'
                ? 'opacity-0 translate-x-4 scale-95'
                : 'opacity-0 -translate-x-4 scale-95'
              : 'opacity-100 translate-x-0 scale-100'
          }`}
        >
          {step === 1 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="h-1 w-1 rounded-full bg-purple-500 animate-pulse" />
                <p className="text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {WIZARD_STEPS[0].title}
                </p>
              </div>
              <StepTriggerType selected={selectedTrigger} onSelect={setSelectedTrigger} />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="h-1 w-1 rounded-full bg-purple-500 animate-pulse" />
                <p className="text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {WIZARD_STEPS[1].title}
                </p>
              </div>
              {selectedTrigger ? (
                <StepTriggerConditions
                  triggerType={selectedTrigger}
                  value={triggerConditions}
                  onChange={setTriggerConditions}
                />
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl p-8 text-center">
                  <p className="text-sm text-gray-400">
                    Selecciona un tipo de disparador primero
                  </p>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="h-1 w-1 rounded-full bg-purple-500 animate-pulse" />
                <p className="text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {WIZARD_STEPS[2].title}
                </p>
              </div>
              <StepActionType selected={selectedAction} onSelect={setSelectedAction} />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="h-1 w-1 rounded-full bg-purple-500 animate-pulse" />
                <p className="text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {WIZARD_STEPS[3].title}
                </p>
              </div>
              {selectedAction ? (
                <StepActionParams
                  actionType={selectedAction}
                  value={actionParams}
                  onChange={setActionParams}
                />
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl p-8 text-center">
                  <p className="text-sm text-gray-400">
                    Selecciona un tipo de acción primero
                  </p>
                </div>
              )}
            </div>
          )}

          {step === 5 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="h-1 w-1 rounded-full bg-purple-500 animate-pulse" />
                <p className="text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {WIZARD_STEPS[4].title}
                </p>
              </div>
              <StepReview
                name={name}
                setName={setName}
                description={description}
                setDescription={setDescription}
                selectedTrigger={selectedTrigger}
                triggerConditions={triggerConditions}
                selectedAction={selectedAction}
                actionParams={actionParams}
                maxExecutions={maxExecutions}
                setMaxExecutions={setMaxExecutions}
                minBalance={minBalance}
                setMinBalance={setMinBalance}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-gray-100/80 dark:border-gray-700/80">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200 hover:-translate-x-0.5"
        >
          <ChevronLeft className="h-4 w-4" />
          {step === 1 ? 'Cancelar' : 'Anterior'}
        </button>

        {step < 5 ? (
          <button
            type="button"
            onClick={handleNext}
            disabled={!canNext()}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-5 py-2.5 text-sm font-semibold shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg"
          >
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleCreate}
            disabled={createMutation.isPending || !name.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white px-5 py-2.5 text-sm font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg"
          >
            {createMutation.isPending ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creando...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Crear Automatización
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
