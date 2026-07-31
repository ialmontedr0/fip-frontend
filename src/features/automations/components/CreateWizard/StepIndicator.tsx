import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { WIZARD_STEPS } from '../../constants'

export default function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8 animate-fade-in overflow-x-auto pb-1">
      {WIZARD_STEPS.map((step, idx) => (
        <div key={step.id} className="flex items-center shrink-0">
          <div className="flex flex-col items-center gap-1.5 group">
            <div
              className={cn(
                'relative flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold transition-all duration-500',
                currentStep > step.id
                  ? 'bg-gradient-to-br from-emerald-400 to-green-600 text-white shadow-lg shadow-emerald-500/30 scale-100'
                  : currentStep === step.id
                  ? 'bg-gradient-to-br from-purple-400 to-indigo-600 text-white shadow-lg shadow-purple-500/30 scale-110'
                  : 'bg-gray-200/80 dark:bg-gray-700/80 text-gray-500 dark:text-gray-400 scale-100',
              )}
            >
              {currentStep > step.id ? (
                <Check className="h-4 w-4 animate-fade-in" />
              ) : (
                <span className={currentStep === step.id ? 'animate-fade-in' : ''}>{step.id}</span>
              )}
              {currentStep === step.id && (
                <div className="absolute inset-0 rounded-full animate-ping bg-purple-400/20 dark:bg-purple-500/20" />
              )}
            </div>
            <span
              className={cn(
                'text-[10px] font-medium whitespace-nowrap transition-all duration-300 hidden md:block',
                currentStep > step.id
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : currentStep === step.id
                  ? 'text-purple-700 dark:text-purple-300 font-semibold'
                  : 'text-gray-400 dark:text-gray-500',
              )}
            >
              {step.label}
            </span>
          </div>
          {idx < WIZARD_STEPS.length - 1 && (
            <div
              className={cn(
                'relative h-0.5 w-8 sm:w-16 mx-2 rounded-full transition-all duration-500 overflow-hidden',
                currentStep > step.id ? 'bg-emerald-400' : 'bg-gray-200 dark:bg-gray-700',
              )}
            >
              {currentStep > step.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 animate-pulse" />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
