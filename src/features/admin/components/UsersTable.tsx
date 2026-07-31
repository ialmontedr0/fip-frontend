import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Search, Users, Loader2, Plus, Pencil } from 'lucide-react'
import { useAdminUsers } from '../hooks/useAdmin'
import UserStatusToggle from './UserStatusToggle'
import UserRoleSelect from './UserRoleSelect'
import CreateUserModal from './CreateUserModal'
import EditUserModal from './EditUserModal'

export default function UsersTable() {
  const navigate = useNavigate()
  const [skip, setSkip] = useState(0)
  const [limit] = useState(20)
  const [roleFilter, setRoleFilter] = useState('')
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [editUserId, setEditUserId] = useState<string | null>(null)

  const { data, isLoading } = useAdminUsers(skip, limit, roleFilter || undefined)

  const totalPages = data ? Math.ceil(data.total / limit) : 0
  const currentPage = Math.floor(skip / limit) + 1

  const users = data?.users ?? []

  const filteredUsers = search
    ? users.filter((u) =>
        u.email.toLowerCase().includes(search.toLowerCase()),
      )
    : users

  return (
    <div>
      <CreateUserModal open={showCreate} onClose={() => setShowCreate(false)} />
      {editUserId && (
        <EditUserModal userId={editUserId} open={!!editUserId} onClose={() => setEditUserId(null)} />
      )}

      <div className="space-y-4">
        {/* Search + Filter + Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por email..."
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setSkip(0) }}
            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 appearance-none"
          >
            <option value="">Todos los roles</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderador</option>
            <option value="user">Usuario</option>
          </select>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all"
          >
            <Plus className="h-4 w-4" />
            Nuevo Usuario
          </button>
        </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
              <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Email</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Rol</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Verificado</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Activo</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Creado</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider w-16">Acción</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400 mx-auto" />
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <Users className="h-8 w-8" />
                    <p className="text-sm font-medium">No se encontraron usuarios</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => navigate(`/admin/users/${user.id}`)}
                  className="border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 text-xs font-bold text-purple-600 dark:text-purple-400">
                        {user.email[0].toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <UserRoleSelect userId={user.id} currentRole={user.role} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn(
                      'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold',
                      user.is_verified
                        ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300',
                    )}>
                      {user.is_verified ? 'S\u00ed' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <UserStatusToggle userId={user.id} isActive={user.is_active} />
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-gray-400 dark:text-gray-500">
                    {new Date(user.created_at).toLocaleDateString('es-DO', {
                      year: 'numeric', month: 'short', day: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditUserId(user.id) }}
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/10 transition-all"
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {data?.total ?? 0} usuario(s) — P\u00e1gina {currentPage} de {totalPages || 1}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSkip(Math.max(0, skip - limit))}
            disabled={skip === 0}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 transition-all"
          >
            Anterior
          </button>
          <button
            onClick={() => setSkip(skip + limit)}
            disabled={skip + limit >= (data?.total ?? 0)}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 transition-all"
          >
            Siguiente
          </button>
        </div>
      </div>
      </div>
    </div>
  )
}
