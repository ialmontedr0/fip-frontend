import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ONBOARDING_STEPS, ONBOARDING_STORAGE_KEY, type OnboardingStep } from '../constants'

type OnboardingStepId = OnboardingStep['id']

const STEP_IDS: OnboardingStepId[] = ONBOARDING_STEPS.map((s) => s.id)

interface OnboardingState {
  currentStep: OnboardingStepId
  isCompleted: boolean
  isDismissed: boolean
  completedSteps: OnboardingStepId[]
  goToStep: (step: OnboardingStepId) => void
  completeStep: (step: OnboardingStepId) => void
  nextStep: () => void
  prevStep: () => void
  skip: () => void
  dismiss: () => void
  reset: () => void
}

const INITIAL_STATE = {
  currentStep: 'accounts' as OnboardingStepId,
  isCompleted: false,
  isDismissed: false,
  completedSteps: [] as OnboardingStepId[],
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

        const idx = STEP_IDS.indexOf(currentStep)
        if (idx < STEP_IDS.length - 1) {
          set({ currentStep: STEP_IDS[idx + 1] })
        } else {
          set({ isCompleted: true, isDismissed: true })
        }
      },

      prevStep: () => {
        const { currentStep } = get()
        const idx = STEP_IDS.indexOf(currentStep)
        if (idx > 0) {
          set({ currentStep: STEP_IDS[idx - 1] })
        }
      },

      skip: () => set({ isDismissed: true, isCompleted: true }),

      dismiss: () => set({ isDismissed: true }),

      reset: () => set(INITIAL_STATE),
    }),
    {
      name: ONBOARDING_STORAGE_KEY,
    },
  ),
)
