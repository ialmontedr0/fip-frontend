import { cn } from '@/lib/utils'
import { Shield, Pencil, Trash2 } from 'lucide-react'
import { useAdminPermissions, useAssignPermission } from '../hooks/useAdmin'
import type { RoleResponse } from '@/types/admin'

interface RolePermissionsPanelProps {
  role: RoleResponse
  onEdit: () => void
  onDelete: () => void
}

export default function RolePermissionsPanel({ role, onEdit, onDelete }: RolePermissionsPanelProps) {
  const { data: permsData } = useAdminPermissions()
  const assignPerm = useAssignPermission()

  const allPermissions = permsData?.permissions ?? []

  const handleAssign = (permissionId: string) => {
    assignPerm.mutate({ roleId: role.id, permission_id: permissionId })
  }

  return (
    <div className="rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20">
            <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">{role.display_name}</h3>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">{role.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {!role.is_system && (
            <>
              <button
                onClick={onEdit}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Editar rol"
              >
                <Pencil className="h-4 w-4 text-gray-400" />
              </button>
              <button
                onClick={onDelete}
                className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                title="Eliminar rol"
              >
                <Trash2 className="h-4 w-4 text-red-400" />
              </button>
            </>
          )}
        </div>
      </div>

      {role.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{role.description}</p>
      )}

      {/* Info */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-3 text-center">
          <p className="text-lg font-bold text-gray-900 dark:text-white">{role.is_system ? 'S\u00ed' : 'No'}</p>
          <p className="text-[10px] font-semibold text-gray-400 uppercase">Sistema</p>
        </div>
        <div className="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-3 text-center">
          <p className={cn(
            'text-lg font-bold',
            role.is_active ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500',
          )}>
            {role.is_active ? 'Activo' : 'Inactivo'}
          </p>
          <p className="text-[10px] font-semibold text-gray-400 uppercase">Estado</p>
        </div>
      </div>

      {/* Assigned Permissions */}
      <div className="mb-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2.5">
          Permisos ({allPermissions.length} disponibles)
        </h4>
        <p className="text-xs text-gray-400">Usa el selector inferior para asignar permisos a este rol.</p>
      </div>

      {/* Add Permission */}
      {!role.is_system && (
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2.5">
            A\u00f1adir Permiso
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {allPermissions.length === 0 ? (
              <p className="text-xs text-gray-400">Todos los permisos asignados</p>
            ) : (
              <select
                value=""
                onChange={(e) => {
                  if (e.target.value) handleAssign(e.target.value)
                  e.target.value = ''
                }}
                className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              >
                <option value="">Seleccionar permiso...</option>
                {allPermissions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.resource}:{p.action} — {p.description || p.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
