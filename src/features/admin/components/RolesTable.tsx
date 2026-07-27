import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Shield, Loader2, Plus } from 'lucide-react'
import { useAdminRoles, useDeleteRole } from '../hooks/useAdmin'
import RoleFormModal from './RoleFormModal'
import RolePermissionsPanel from './RolePermissionsPanel'
import type { RoleResponse } from '@/types/admin'

export default function RolesTable() {
  const { data, isLoading } = useAdminRoles(true)
  const deleteRole = useDeleteRole()
  const [editingRole, setEditingRole] = useState<RoleResponse | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedRole, setSelectedRole] = useState<RoleResponse | null>(null)
  const [showInactive, setShowInactive] = useState(false)

  const roles = data?.roles.filter((r) => showInactive || r.is_active) ?? []

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={() => setShowInactive(!showInactive)}
            className="rounded border-gray-300 dark:border-gray-600 text-purple-500 focus:ring-purple-500/30"
          />
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Mostrar inactivos</span>
        </label>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.97] transition-all"
        >
          <Plus className="h-3.5 w-3.5" />
          Nuevo Rol
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Roles List */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : roles.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-gray-400">
                <Shield className="h-8 w-8 mb-2" />
                <p className="text-sm font-medium">No hay roles</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role)}
                    className={cn(
                      'w-full text-left p-4 transition-all hover:bg-gray-50 dark:hover:bg-gray-800/30',
                      selectedRole?.id === role.id && 'bg-purple-50 dark:bg-purple-500/5',
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {role.display_name}
                        </p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 font-mono">
                          {role.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {role.is_system && (
                          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300">
                            SYSTEM
                          </span>
                        )}
                        {!role.is_active && (
                          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300">
                            INACTIVE
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Selected Role Panel */}
        <div className="lg:col-span-3">
          {selectedRole ? (
            <RolePermissionsPanel
              role={selectedRole}
              onEdit={() => setEditingRole(selectedRole)}
              onDelete={() => {
                if (confirm(`\u00bfEliminar rol "${selectedRole.display_name}"?`)) {
                  deleteRole.mutate(selectedRole.id, {
                    onSuccess: () => setSelectedRole(null),
                  })
                }
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-16 text-gray-400">
              <Shield className="h-12 w-12 mb-3 opacity-30" />
              <p className="text-sm font-medium">Selecciona un rol para ver sus detalles</p>
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <RoleFormModal
          onClose={() => setShowCreateModal(false)}
        />
      )}
      {editingRole && (
        <RoleFormModal
          role={editingRole}
          onClose={() => setEditingRole(null)}
        />
      )}
    </div>
  )
}
