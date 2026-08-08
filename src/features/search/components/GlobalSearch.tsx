import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ArrowRight } from 'lucide-react'
import { searchSuggestions, type SearchSuggestion } from '../api/search'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function GlobalSearch({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const ac = new AbortController()
    let active = true
    const timer = setTimeout(async () => {
      if (!query.trim() || query.trim().length < 2) {
        setSuggestions([])
        return
      }
      try {
        const data = await searchSuggestions(query.trim(), ac.signal)
        if (active && !ac.signal.aborted) setSuggestions(data.suggestions)
      } catch {
        if (active) setSuggestions([])
      }
    }, 250)
    return () => {
      active = false
      clearTimeout(timer)
      ac.abort()
    }
  }, [query])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const submit = () => {
    if (!query.trim()) return
    navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-24 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Búsqueda global"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose()
      }}
    >
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4">
        <div className="flex items-center gap-3 border-b border-gray-200 dark:border-gray-700 pb-3">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submit()
            }}
            placeholder="Buscar transacciones, categorías, cuentas..."
            className="flex-1 bg-transparent text-sm text-gray-900 dark:text-gray-100 outline-none placeholder-gray-400"
          />
          <button type="button" onClick={submit} aria-label="Buscar" className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <ArrowRight className="h-4 w-4 text-gray-400" />
          </button>
        </div>

        {suggestions.length > 0 && (
          <ul className="mt-3 space-y-1 max-h-72 overflow-auto">
            {suggestions.map((s) => (
              <li key={`${s.type}-${s.id}`}>
                <button
                  type="button"
                  onClick={() => {
                    navigate(`/search?q=${encodeURIComponent(s.label)}`)
                    onClose()
                  }}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50"
                >
                  <span className="capitalize text-xs text-gray-400 mr-2">{s.type}</span>
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
