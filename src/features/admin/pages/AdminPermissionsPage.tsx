import { Key, Loader2, Search } from 'lucide-react'
import { useState } from 'react'
import { useAdminPermissions } from '../hooks/useAdmin'
import PermissionBadge from '../components/PermissionBadge'
import AdminNav from '../components/AdminNav'

export default function AdminPermissionsPage() {
  const { data, isLoading } = useAdminPermissions()
  const [search, setSearch] = useState('')

  const permissions = data?.permissions ?? []
  const filtered = search
    ? permissions.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.resource.toLowerCase().includes(search.toLowerCase()) ||
          p.action.toLowerCase().includes(search.toLowerCase()),
      )
    : permissions

  const grouped = filtered.reduce(
    (acc, p) => {
      if (!acc[p.resource]) acc[p.resource] = []
      acc[p.resource].push(p)
      return acc
    },
    {} as Record<string, typeof permissions>,
  )

  return (
    <div className="relative space-y-6 pb-8">
      <AdminNav />

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary-500/5 blur-3xl dark:bg-primary-500/10" />
        <div className="absolute -right-40 top-1/3 h-80 w-80 rounded-full bg-violet-500/5 blur-3xl dark:bg-violet-500/10" />
      </div>

      <div className="sticky top-0 z-30 -mx-6 -mt-6 border-b border-gray-100 bg-white/80 px-6 pb-5 pt-6 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/80">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20">
              <Key className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Permisos</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{permissions.length} permisos en el sistema</p>
            </div>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar permisos..."
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="flex flex-col items-center py-16 text-gray-400">
          <Key className="h-12 w-12 mb-3 opacity-30" />
          <p className="text-sm font-medium">No se encontraron permisos</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(grouped).map(([resource, perms]) => (
            <div
              key={resource}
              className="rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-4 shadow-sm"
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                {resource}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {perms.map((p) => (
                  <PermissionBadge key={p.id} name={p.name} resource={p.resource} action={p.action} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
