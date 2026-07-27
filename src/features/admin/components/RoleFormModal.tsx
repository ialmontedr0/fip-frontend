import { useState } from 'react'
import { X, Save } from 'lucide-react'
import { useCreateRole, useUpdateRole } from '../hooks/useAdmin'
import type { RoleResponse } from '@/types/admin'

interface RoleFormModalProps {
  role?: RoleResponse
  onClose: () => void
}

export default function RoleFormModal({ role, onClose }: RoleFormModalProps) {
  const isEdit = !!role
  const [name, setName] = useState(role?.name ?? '')
  const [displayName, setDisplayName] = useState(role?.display_name ?? '')
  const [description, setDescription] = useState(role?.description ?? '')
  const [isActive, setIsActive] = useState(role?.is_active ?? true)

  const createRole = useCreateRole()
  const updateRole = useUpdateRole()
  const isPending = createRole.isPending || updateRole.isPending

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isEdit) {
      await updateRole.mutateAsync({
        roleId: role!.id,
        display_name: displayName,
        description: description || undefined,
        is_active: isActive,
      })
    } else {
      await createRole.mutateAsync({ name, display_name: displayName, description: description || undefined })
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white dark:bg-gray-900 shadow-2xl animate-fade-in-up">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            {isEdit ? 'Editar Rol' : 'Crear Nuevo Rol'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="h-4 w-4 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {!isEdit && (
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                Nombre interno
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="ej: editor"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
              Nombre visible
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              placeholder="ej: Editor"
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
              Descripci\u00f3n
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Opcional"
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 resize-none"
            />
          </div>

          {isEdit && (
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600 text-purple-500 focus:ring-purple-500/30"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Rol activo</span>
            </label>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl py-3 text-sm font-bold bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.97] transition-all disabled:opacity-50"
          >
            {isPending ? (
              <span className="inline-flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Guardando...
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <Save className="h-4 w-4" />
                {isEdit ? 'Guardar Cambios' : 'Crear Rol'}
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
