interface RolloverToggleProps {
  value: boolean
  onChange: (value: boolean) => void
  disabled?: boolean
}

export default function RolloverToggle({ value, onChange, disabled }: RolloverToggleProps) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
      <button
        type="button"
        role="switch"
        aria-checked={value}
        disabled={disabled}
        onClick={() => !disabled && onChange(!value)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${value ? 'bg-violet-500' : 'bg-gray-200 dark:bg-gray-700'}`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${value ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </button>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Arrastrar saldo no gastado
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          El saldo no utilizado se acumulara al siguiente periodo del presupuesto
        </p>
      </div>
    </div>
  )
}
