import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type OnboardingStep = 'welcome' | 'create_account' | 'first_transaction' | 'explore_categories' | 'done'

const ONBOARDING_STEPS: OnboardingStep[] = [
  'welcome',
  'create_account',
  'first_transaction',
  'explore_categories',
]

interface OnboardingState {
  currentStep: OnboardingStep
  isCompleted: boolean
  isDismissed: boolean
  completedSteps: OnboardingStep[]
  goToStep: (step: OnboardingStep) => void
  completeStep: (step: OnboardingStep) => void
  nextStep: () => void
  prevStep: () => void
  skip: () => void
  dismiss: () => void
  reset: () => void
}

const INITIAL_STATE = {
  currentStep: 'welcome' as OnboardingStep,
  isCompleted: false,
  isDismissed: false,
  completedSteps: [] as OnboardingStep[],
}

export const useOnboarding = create<OnboardingState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      goToStep: (step) => set({ currentStep: step }),

      completeStep: (step) => {
        const { completedSteps } = get()
        if (!completedSteps.includes(step)) {
          set({ completedSteps: [...completedSteps, step] })
        }
      },

      nextStep: () => {
        const { currentStep } = get()
        get().completeStep(currentStep)

        const idx = ONBOARDING_STEPS.indexOf(currentStep)
        if (idx < ONBOARDING_STEPS.length - 1) {
          set({ currentStep: ONBOARDING_STEPS[idx + 1] })
        } else {
          set({ isCompleted: true, currentStep: 'done' })
        }
      },

      prevStep: () => {
        const { currentStep } = get()
        const idx = ONBOARDING_STEPS.indexOf(currentStep)
        if (idx > 0) {
          set({ currentStep: ONBOARDING_STEPS[idx - 1] })
        }
      },

      skip: () => set({ isDismissed: true, isCompleted: true }),

      dismiss: () => set({ isDismissed: true }),

      reset: () => set(INITIAL_STATE),
    }),
    {
      name: 'fip-onboarding',
    },
  ),
)
