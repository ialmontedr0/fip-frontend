import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Search as SearchIcon, ArrowLeft, ArrowRight, Loader2, LayoutDashboard, Wallet, Banknote, BarChart3, Target, PiggyBank, Repeat, CreditCard, HandCoins, Settings, Bell, Shield, Bot, GanttChartSquare, FileUp, FileDown, TrendingUp, TrendingDown, Tags, BookOpen } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

const PAGE_INDEX = [
  { label: 'Dashboard', href: '/dashboard', keywords: ['dashboard', 'inicio', 'resumen', 'home'], icon: 'LayoutDashboard', category: 'General' },
  { label: 'Cuentas', href: '/accounts', keywords: ['cuentas', 'accounts', 'bancos', 'banks'], icon: 'Wallet', category: 'Finanzas' },
  { label: 'Nueva Cuenta', href: '/accounts/new', keywords: ['nueva cuenta', 'crear cuenta', 'add account'], icon: 'Wallet', category: 'Finanzas' },
  { label: 'Carteras', href: '/wallets', keywords: ['carteras', 'wallets', 'portafolio', 'portfolio'], icon: 'Banknote', category: 'Finanzas' },
  { label: 'Transacciones', href: '/transactions', keywords: ['transacciones', 'transactions', 'movimientos'], icon: 'TrendingUp', category: 'Finanzas' },
  { label: 'Nueva Transaccion', href: '/transactions/new', keywords: ['nueva transaccion', 'crear transaccion', 'nuevo movimiento'], icon: 'TrendingUp', category: 'Finanzas' },
  { label: 'Transacciones Recurrentes', href: '/transactions/recurring', keywords: ['recurrentes', 'recurring', 'automaticas'], icon: 'Repeat', category: 'Finanzas' },
  { label: 'Ingresos', href: '/incomes', keywords: ['ingresos', 'incomes', 'entradas', 'depositos'], icon: 'TrendingUp', category: 'Ingresos' },
  { label: 'Nuevo Ingreso', href: '/incomes/new', keywords: ['nuevo ingreso', 'crear ingreso', 'add income'], icon: 'TrendingUp', category: 'Ingresos' },
  { label: 'Fuentes de Ingreso', href: '/incomes/sources', keywords: ['fuentes ingreso', 'income sources', 'origenes'], icon: 'TrendingUp', category: 'Ingresos' },
  { label: 'Calendario de Ingresos', href: '/incomes/schedule', keywords: ['calendario ingresos', 'income schedule', 'plan'], icon: 'TrendingUp', category: 'Ingresos' },
  { label: 'Ingresos Recurrentes', href: '/incomes/recurring', keywords: ['ingresos recurrentes', 'recurring income'], icon: 'Repeat', category: 'Ingresos' },
  { label: 'Ingresos Irregulares', href: '/incomes/irregular', keywords: ['ingresos irregulares', 'irregular income', 'variables'], icon: 'TrendingUp', category: 'Ingresos' },
  { label: 'Gastos', href: '/expenses', keywords: ['gastos', 'expenses', 'salidas', 'spending'], icon: 'TrendingDown', category: 'Gastos' },
  { label: 'Nuevo Gasto', href: '/expenses/new', keywords: ['nuevo gasto', 'crear gasto', 'add expense'], icon: 'TrendingDown', category: 'Gastos' },
  { label: 'Plantillas de Gasto', href: '/expenses/templates', keywords: ['plantillas gasto', 'templates', 'modelos'], icon: 'BookOpen', category: 'Gastos' },
  { label: 'Servicios', href: '/expenses/services', keywords: ['servicios', 'services', 'electricidad', 'agua', 'internet'], icon: 'TrendingDown', category: 'Gastos' },
  { label: 'Suscripciones', href: '/expenses/subscriptions', keywords: ['suscripciones', 'subscriptions', 'netflix', 'spotify'], icon: 'Repeat', category: 'Gastos' },
  { label: 'Tarjetas de Credito', href: '/expenses/cards', keywords: ['tarjetas credito', 'credit cards'], icon: 'CreditCard', category: 'Gastos' },
  { label: 'Gastos Duplicados', href: '/expenses/duplicates', keywords: ['duplicados', 'duplicates', 'repetidos'], icon: 'TrendingDown', category: 'Gastos' },
  { label: 'Gastos Recurrentes', href: '/expenses/recurring', keywords: ['gastos recurrentes', 'recurring expenses'], icon: 'Repeat', category: 'Gastos' },
  { label: 'Categorias', href: '/categories', keywords: ['categorias', 'categories'], icon: 'Tags', category: 'General' },
  { label: 'Metas', href: '/goals', keywords: ['metas', 'goals', 'objetivos', 'ahorros'], icon: 'Target', category: 'Finanzas' },
  { label: 'Presupuestos', href: '/budgets', keywords: ['presupuestos', 'budgets'], icon: 'PiggyBank', category: 'Finanzas' },
  { label: 'Alertas de Presupuesto', href: '/budgets/alerts', keywords: ['alertas presupuesto', 'budget alerts'], icon: 'PiggyBank', category: 'Finanzas' },
  { label: 'Tarjetas', href: '/cards', keywords: ['tarjetas', 'cards', 'plasticos'], icon: 'CreditCard', category: 'Finanzas' },
  { label: 'Compras a Credito', href: '/credit-purchases', keywords: ['compras credito', 'credit purchases', 'financiamiento'], icon: 'HandCoins', category: 'Finanzas' },
  { label: 'Prestamos', href: '/loans', keywords: ['prestamos', 'loans', 'creditos'], icon: 'HandCoins', category: 'Finanzas' },
  { label: 'Analiticas', href: '/analytics', keywords: ['analiticas', 'analytics', 'estadisticas', 'reportes'], icon: 'BarChart3', category: 'Inteligencia' },
  { label: 'IA - Dashboard', href: '/ai/dashboard', keywords: ['ia dashboard', 'ai', 'inteligencia artificial'], icon: 'Bot', category: 'Inteligencia' },
  { label: 'IA - Clasificar', href: '/ai/classify', keywords: ['ia clasificar', 'ai classify', 'clasificacion automatica'], icon: 'Bot', category: 'Inteligencia' },
  { label: 'IA - Predecir', href: '/ai/predict', keywords: ['ia predecir', 'ai predict', 'predicciones', 'forecast'], icon: 'Bot', category: 'Inteligencia' },
  { label: 'IA - Anomalias', href: '/ai/anomalies', keywords: ['ia anomalias', 'ai anomalies', 'deteccion'], icon: 'Bot', category: 'Inteligencia' },
  { label: 'IA - Recomendaciones', href: '/ai/recommendations', keywords: ['ia recomendaciones', 'ai recommendations', 'consejos'], icon: 'Bot', category: 'Inteligencia' },
  { label: 'IA - Habitos', href: '/ai/habits', keywords: ['ia habitos', 'ai habits', 'comportamiento'], icon: 'Bot', category: 'Inteligencia' },
  { label: 'IA - Riesgos', href: '/ai/risks', keywords: ['ia riesgos', 'ai risks', 'alertas'], icon: 'Bot', category: 'Inteligencia' },
  { label: 'IA - Ahorros', href: '/ai/savings', keywords: ['ia ahorros', 'ai savings', 'optimizacion'], icon: 'Bot', category: 'Inteligencia' },
  { label: 'IA - Modelos', href: '/ai/models', keywords: ['ia modelos', 'ai models', 'machine learning'], icon: 'Bot', category: 'Inteligencia' },
  { label: 'Automatizaciones', href: '/automations', keywords: ['automatizaciones', 'automations', 'reglas'], icon: 'GantChartSquare', category: 'Configuracion' },
  { label: 'Notificaciones', href: '/notifications', keywords: ['notificaciones', 'notifications', 'alertas'], icon: 'Bell', category: 'Configuracion' },
  { label: 'Importaciones', href: '/imports', keywords: ['importaciones', 'imports', 'csv', 'cargar'], icon: 'FileUp', category: 'Configuracion' },
  { label: 'Exportaciones', href: '/exports', keywords: ['exportaciones', 'exports', 'excel', 'pdf', 'descargar'], icon: 'FileDown', category: 'Configuracion' },
  { label: 'Configuracion', href: '/settings', keywords: ['configuracion', 'settings', 'ajustes', 'preferencias'], icon: 'Settings', category: 'Configuracion' },
  { label: 'Perfil', href: '/settings/profile', keywords: ['perfil', 'profile', 'nombre', 'email', 'avatar'], icon: 'Settings', category: 'Configuracion' },
  { label: 'Preferencias', href: '/settings/preferences', keywords: ['preferencias', 'preferences', 'moneda', 'idioma'], icon: 'Settings', category: 'Configuracion' },
  { label: 'Seguridad', href: '/settings/security', keywords: ['seguridad', 'security', 'password', 'contrasena', '2fa', 'mfa'], icon: 'Shield', category: 'Configuracion' },
  { label: 'Notificaciones', href: '/settings/notifications', keywords: ['notificaciones', 'notifications', 'canales', 'telegram', 'email'], icon: 'Bell', category: 'Configuracion' },
  { label: 'Admin - Usuarios', href: '/admin/users', keywords: ['admin usuarios', 'admin users', 'administracion'], icon: 'Shield', category: 'Admin' },
  { label: 'Admin - Roles', href: '/admin/roles', keywords: ['admin roles', 'permisos', 'permissions'], icon: 'Shield', category: 'Admin' },
  { label: 'Admin - Permisos', href: '/admin/permissions', keywords: ['admin permisos', 'permissions'], icon: 'Shield', category: 'Admin' },
  { label: 'Admin - Auditoria', href: '/admin/audit-logs', keywords: ['admin auditoria', 'audit', 'logs', 'historial'], icon: 'Shield', category: 'Admin' },
  { label: 'Admin - Estadisticas', href: '/admin/stats', keywords: ['admin estadisticas', 'admin stats', 'metricas'], icon: 'BarChart3', category: 'Admin' },
]

interface SearchResultGroup {
  category: string
  icon: string
  items: Array<{ label: string; href: string; subtitle: string; type?: string }>
}

const ICON_MAP: Record<string, typeof LayoutDashboard> = {
  LayoutDashboard, Wallet, Banknote, BarChart3, Target, PiggyBank, Repeat,
  CreditCard, HandCoins, Settings, Bell, Shield, Bot,   GanttChartSquare,
  FileUp, FileDown, TrendingUp, TrendingDown, Tags, BookOpen, SearchIcon,
}

function matchQuery(text: string, query: string): boolean {
  const q = query.toLowerCase()
  return text.toLowerCase().includes(q)
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

  const { data: incomeResults, isLoading: incomeLoading } = useQuery({
    queryKey: ['search', 'incomes', q],
    queryFn: () =>
      api.get('/incomes', { params: { limit: 5, search: q } }).then(r => r.data?.incomes || r.data || []),
    enabled: q.length > 0,
  })

  const { data: expenseResults, isLoading: expenseLoading } = useQuery({
    queryKey: ['search', 'expenses', q],
    queryFn: () =>
      api.get('/expenses', { params: { limit: 5, search: q } }).then(r => r.data?.expenses || r.data || []),
    enabled: q.length > 0,
  })

  const { data: loanResults, isLoading: loanLoading } = useQuery({
    queryKey: ['search', 'loans', q],
    queryFn: () =>
      api.get('/loans', { params: { limit: 5 } }).then(r => r.data?.loans || r.data || []),
    enabled: q.length > 0,
  })

  const { data: accountResults, isLoading: accountLoading } = useQuery({
    queryKey: ['search', 'accounts', q],
    queryFn: () =>
      api.get('/accounts', { params: { limit: 20 } }).then(r => r.data?.accounts || r.data || []),
    enabled: q.length > 0,
  })

  const { data: walletResults, isLoading: walletLoading } = useQuery({
    queryKey: ['search', 'wallets', q],
    queryFn: () =>
      api.get('/wallets', { params: { limit: 20 } }).then(r => r.data?.wallets || r.data || []),
    enabled: q.length > 0,
  })

  const { data: goalResults, isLoading: goalLoading } = useQuery({
    queryKey: ['search', 'goals', q],
    queryFn: () =>
      api.get('/goals', { params: { limit: 20 } }).then(r => r.data?.goals || r.data || []),
    enabled: q.length > 0,
  })

  const { data: budgetResults, isLoading: budgetLoading } = useQuery({
    queryKey: ['search', 'budgets', q],
    queryFn: () =>
      api.get('/budgets', { params: { limit: 20 } }).then(r => r.data?.budgets || r.data || []),
    enabled: q.length > 0,
  })

  const { data: categoryResults, isLoading: categoryLoading } = useQuery({
    queryKey: ['search', 'categories', q],
    queryFn: () =>
      api.get('/categories', { params: { limit: 50 } }).then(r => r.data?.categories || r.data || []),
    enabled: q.length > 0,
  })

  const loading = txLoading || incomeLoading || expenseLoading || loanLoading || accountLoading || walletLoading || goalLoading || budgetLoading || categoryLoading

  const groups: SearchResultGroup[] = useMemo(() => {
    if (!q) return []
    const groups: SearchResultGroup[] = []

    const pageResults = PAGE_INDEX
      .filter(p => matchQuery(p.label, q) || p.keywords.some(k => matchQuery(k, q)))
    if (pageResults.length > 0) {
      const byCategory: Record<string, SearchResultGroup> = {}
      for (const p of pageResults) {
        if (!byCategory[p.category]) {
          byCategory[p.category] = { category: p.category, icon: p.icon, items: [] }
        }
        byCategory[p.category].items.push({ label: p.label, href: p.href, subtitle: '' })
      }
      groups.push(...Object.values(byCategory))
    }

    if (txResults && Array.isArray(txResults)) {
      const txItems = txResults.map((tx: any) => ({
        label: tx.description || 'Transaccion',
        href: `/transactions/${tx.id}`,
        subtitle: `$${tx.amount} — ${tx.effective_date || ''}`,
        type: 'Transaccion',
      }))
      if (txItems.length > 0) {
        groups.push({ category: 'Transacciones', icon: 'TrendingUp', items: txItems })
      }
    }

    if (incomeResults && Array.isArray(incomeResults)) {
      const incItems = incomeResults.map((inc: any) => ({
        label: inc.description || 'Ingreso',
        href: `/incomes/${inc.id}`,
        subtitle: `$${inc.amount} — ${inc.effective_date || ''}`,
        type: 'Ingreso',
      }))
      if (incItems.length > 0) {
        groups.push({ category: 'Ingresos', icon: 'TrendingUp', items: incItems })
      }
    }

    if (expenseResults && Array.isArray(expenseResults)) {
      const expItems = expenseResults.map((exp: any) => ({
        label: exp.description || 'Gasto',
        href: `/expenses/${exp.id}`,
        subtitle: `$${exp.amount} — ${exp.effective_date || ''}`,
        type: 'Gasto',
      }))
      if (expItems.length > 0) {
        groups.push({ category: 'Gastos', icon: 'TrendingDown', items: expItems })
      }
    }

    if (loanResults && Array.isArray(loanResults)) {
      const loanItems = loanResults
        .filter((l: any) => matchQuery(l.name || '', q))
        .map((l: any) => ({
          label: l.name,
          href: `/loans/${l.id}`,
          subtitle: `Balance: $${l.current_balance || '0'}`,
          type: 'Prestamo',
        }))
      if (loanItems.length > 0) {
        groups.push({ category: 'Prestamos', icon: 'HandCoins', items: loanItems })
      }
    }

    if (accountResults && Array.isArray(accountResults)) {
      const accItems = accountResults
        .filter((a: any) => matchQuery(a.name || a.description || '', q))
        .map((a: any) => ({
          label: a.name,
          href: `/accounts/${a.id}`,
          subtitle: `Balance: $${a.balance || '0'} — ${a.account_type || ''}`,
          type: 'Cuenta',
        }))
      if (accItems.length > 0) {
        groups.push({ category: 'Cuentas', icon: 'Wallet', items: accItems })
      }
    }

    if (walletResults && Array.isArray(walletResults)) {
      const wItems = walletResults
        .filter((w: any) => matchQuery(w.name || '', q))
        .map((w: any) => ({
          label: w.name,
          href: `/wallets/${w.id}`,
          subtitle: `Total: $${w.total_balance || '0'}`,
          type: 'Cartera',
        }))
      if (wItems.length > 0) {
        groups.push({ category: 'Carteras', icon: 'Banknote', items: wItems })
      }
    }

    if (goalResults && Array.isArray(goalResults)) {
      const gItems = goalResults
        .filter((g: any) => matchQuery(g.name || g.description || '', q))
        .map((g: any) => ({
          label: g.name,
          href: `/goals/${g.id}`,
          subtitle: `Progreso: ${g.progress_percentage || '0'}% — $${g.current_amount || '0'} de $${g.target_amount || '0'}`,
          type: 'Meta',
        }))
      if (gItems.length > 0) {
        groups.push({ category: 'Metas', icon: 'Target', items: gItems })
      }
    }

    if (budgetResults && Array.isArray(budgetResults)) {
      const bItems = budgetResults
        .filter((b: any) => matchQuery(b.name || b.description || '', q))
        .map((b: any) => ({
          label: b.name,
          href: `/budgets/${b.id}`,
          subtitle: `$${b.spent || '0'} de $${b.limit || '0'}`,
          type: 'Presupuesto',
        }))
      if (bItems.length > 0) {
        groups.push({ category: 'Presupuestos', icon: 'PiggyBank', items: bItems })
      }
    }

    if (categoryResults && Array.isArray(categoryResults)) {
      const cItems = categoryResults
        .filter((c: any) => matchQuery(c.name || c.description || '', q))
        .map((c: any) => ({
          label: c.name,
          href: `/categories/${c.id}`,
          subtitle: c.type || c.category_type || '',
          type: 'Categoria',
        }))
      if (cItems.length > 0) {
        groups.push({ category: 'Categorias', icon: 'Tags', items: cItems })
      }
    }

    return groups
  }, [q, txResults, incomeResults, expenseResults, loanResults, accountResults, walletResults, goalResults, budgetResults, categoryResults])

  useEffect(() => {
    setQuery(q)
  }, [q])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`, { replace: true })
    }
  }

  const totalResults = groups.reduce((sum, g) => sum + g.items.length, 0)

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
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar cuentas, transacciones, categorias..."
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

      {!loading && q && totalResults === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <SearchIcon className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">Sin resultados para &quot;{q}&quot;</p>
          <p className="text-sm mt-1">Intenta con otros terminos</p>
        </div>
      )}

      {!loading && totalResults > 0 && (
        <div className="space-y-6">
          <p className="text-xs text-gray-400 font-medium">{totalResults} resultado(s)</p>
          {groups.map((group) => {
            const GroupIcon = ICON_MAP[group.icon] || SearchIcon
            return (
              <div key={group.category}>
                <div className="flex items-center gap-2 mb-2">
                  <GroupIcon className="h-4 w-4 text-gray-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {group.category}
                  </h3>
                </div>
                <div className="space-y-1">
                  {group.items.map((item, i) => (
                    <button
                      key={`${group.category}-${i}`}
                      type="button"
                      onClick={() => navigate(item.href)}
                      className="w-full text-left flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/50 hover:shadow-md hover:-translate-y-0.5 transition-all"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          {item.type && (
                            <span className="rounded bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 text-[10px] font-bold uppercase text-gray-500 dark:text-gray-400 leading-tight shrink-0">
                              {item.type}
                            </span>
                          )}
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{item.label}</p>
                        </div>
                        {item.subtitle && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5 ml-1">{item.subtitle}</p>
                        )}
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
