import { useState, useRef, type KeyboardEvent } from 'react'
import { cn } from '@/lib/utils'
import { X, Plus } from 'lucide-react'

interface Props {
  value: string[]
  onChange: (tags: string[]) => void
  suggestions?: string[]
  placeholder?: string
  max?: number
  className?: string
}

export default function TagInput({
  value, onChange, suggestions = [],
  placeholder = 'Agregar etiqueta...', max = 20, className,
}: Props) {
  const [input, setInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addTag = (tag: string) => {
    const cleaned = tag.trim().toLowerCase().replace(/\s+/g, '-')
    if (!cleaned || value.length >= max || value.includes(cleaned)) return
    onChange([...value, cleaned])
    setInput('')
    setShowSuggestions(false)
  }

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(input)
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      removeTag(value[value.length - 1])
    }
  }

  const filteredSuggestions = suggestions.filter(
    (s) => !value.includes(s) && s.toLowerCase().includes(input.toLowerCase()),
  )

  return (
    <div className={cn('space-y-1.5', className)}>
      <div
        className={cn(
          'flex flex-wrap gap-1.5 p-2 rounded-xl border border-gray-200 dark:border-gray-700',
          'bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm min-h-[42px]',
          'focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all',
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-lg bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-300 px-2 py-0.5 text-xs font-medium border border-primary-200/50 dark:border-primary-500/20"
          >
            {tag}
            <button
              onClick={(e) => { e.stopPropagation(); removeTag(tag) }}
              className="hover:bg-primary-200/50 dark:hover:bg-primary-500/20 rounded-full p-0.5 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}

        {value.length < max && (
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={value.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[80px] bg-transparent border-none outline-none text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-400 py-0.5"
          />
        )}

        {value.length > 0 && value.length < max && (
          <button
            onClick={() => addTag(input)}
            disabled={!input.trim()}
            className="inline-flex items-center justify-center h-5 w-5 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-30 transition-colors"
          >
            <Plus className="h-3 w-3 text-gray-500" />
          </button>
        )}
      </div>

      {showSuggestions && input && filteredSuggestions.length > 0 && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg overflow-hidden">
          {filteredSuggestions.slice(0, 8).map((suggestion) => (
            <button
              key={suggestion}
              onMouseDown={(e) => { e.preventDefault(); addTag(suggestion) }}
              className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {value.length >= max && (
        <p className="text-xs text-amber-500">Maximo {max} etiquetas</p>
      )}
    </div>
  )
}
