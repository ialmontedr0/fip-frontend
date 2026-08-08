import { useId, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  ariaLabel?: string
}

export default function Select({
  value,
  onChange,
  options,
  placeholder = 'Selecciona...',
  disabled,
  ariaLabel,
}: SelectProps) {
  const [open, setOpen] = useState<boolean>(false)
  const id = useId()
  const selected = options.find((o) => o.value === value)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false)
    } else if (e.key === 'ArrowDown' && !open) {
      setOpen(true)
    } else if (e.key === 'ArrowDown' && open) {
      e.preventDefault()
      const idx = options.findIndex((o) => o.value === value)
      const next = options[idx + 1] ?? options[0]
      if (next) onChange(next.value)
    } else if (e.key === 'ArrowUp' && open) {
      e.preventDefault()
      const idx = options.findIndex((o) => o.value === value)
      const prev = options[idx - 1] ?? options[options.length - 1]
      if (prev) onChange(prev.value)
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        id={id}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleKeyDown}
        className="w-full flex items-center justify-between px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50"
      >
        <span className={selected ? '' : 'text-gray-400 dark:text-gray-500'}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul
          role="listbox"
          aria-labelledby={id}
          className="absolute z-20 mt-1 w-full max-h-60 overflow-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg"
        >
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                role="option"
                aria-selected={opt.value === value}
                disabled={opt.disabled}
                onClick={() => {
                  onChange(opt.value)
                  setOpen(false)
                }}
                className="w-full flex items-center justify-between px-4 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                {opt.label}
                {opt.value === value && <Check className="h-4 w-4 text-violet-500" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
