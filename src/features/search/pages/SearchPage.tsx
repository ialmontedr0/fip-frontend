import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Search, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

interface SearchResult {
  label: string
  href: string
  subtitle: string
}

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const q = searchParams.get('q') || ''
  const [query, setQuery] = useState(q)

  const { data: txResults, isLoading: txLoading } = useQuery({
    queryKey: ['search', 'transactions', q],
    queryFn: () =>
      api.get('/transactions', { params: { limit: 5, search: q } }).then(r => r.data?.transactions || r.data || []),
    enabled: q.length > 0,
  })

  const { data: loanResults, isLoading: loanLoading } = useQuery({
    queryKey: ['search', 'loans', q],
    queryFn: () =>
      api.get('/loans', { params: { limit: 5, search: q } }).then(r => r.data?.loans || r.data || []),
    enabled: q.length > 0,
  })

  const results: SearchResult[] = []
  if (txResults && Array.isArray(txResults)) {
    for (const tx of txResults) {
      results.push({ label: tx.description || 'Transaccion', href: `/transactions/${tx.id}`, subtitle: `$${tx.amount} — ${tx.effective_date || ''}` })
    }
  }
  if (loanResults && Array.isArray(loanResults)) {
    for (const loan of loanResults) {
      results.push({ label: loan.name, href: `/loans/${loan.id}`, subtitle: `Balance: $${loan.current_balance}` })
    }
  }

  useEffect(() => {
    setQuery(q)
  }, [q])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`, { replace: true })
    }
  }

  const loading = txLoading || loanLoading

  return (
    <div className="max-w-2xl mx-auto space-y-6 pt-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver
      </button>

      <form onSubmit={handleSearch}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar transacciones, prestamos..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-lg focus:outline-none focus:ring-2 focus:ring-primary-500/30 shadow-sm"
            autoFocus
          />
        </div>
      </form>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      )}

      {!loading && q && results.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">Sin resultados para &quot;{q}&quot;</p>
          <p className="text-sm mt-1">Intenta con otros terminos</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-400 font-medium">{results.length} resultado(s)</p>
          {results.map((r, i) => (
            <button
              key={i}
              type="button"
              onClick={() => navigate(r.href)}
              className="w-full text-left flex items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/50 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{r.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{r.subtitle}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 shrink-0 ml-2" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
