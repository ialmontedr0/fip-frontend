import { useState, useEffect } from 'react'
import { Loader2, X, Mail, ShieldCheck, Activity, Phone } from 'lucide-react'
import { useAdminUser, useUpdateUser, useAdminRoles } from '../hooks/useAdmin'
import type { UserUpdateRequest } from '@/types/admin'

interface EditUserModalProps {
  userId: string
  open: boolean
  onClose: () => void
}

export default function EditUserModal({ userId, open, onClose }: EditUserModalProps) {
  const { data: user, isLoading } = useAdminUser(userId)
  const { data: rolesData } = useAdminRoles()
  const { mutate: updateUser, isPending } = useUpdateUser()

  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [phone, setPhone] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [isVerified, setIsVerified] = useState(true)

  const roles = rolesData?.roles ?? []

  useEffect(() => {
    if (user) {
      setEmail(user.email)
      setRole(user.role)
      setPhone(user.phone ?? '')
      setIsActive(user.is_active)
      setIsVerified(user.is_verified)
    }
  }, [user])

  if (!open) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data: Partial<UserUpdateRequest> = {}
    if (email !== user?.email) data.email = email
    if (role !== user?.role) data.role = role
    if ((phone || '') !== (user?.phone ?? '')) data.phone = phone || null
    if (isActive !== user?.is_active) data.is_active = isActive
    if (isVerified !== user?.is_verified) data.is_verified = isVerified
    if (Object.keys(data).length === 0) { onClose(); return }
    updateUser({ userId, ...data } as { userId: string } & UserUpdateRequest, { onSuccess: onClose })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white dark:bg-gray-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Editar Usuario</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Rol</label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 appearance-none"
                >
                  {roles.map((r) => (
                    <option key={r.name} value={r.name}>{r.display_name}</option>
                  ))}
                  {roles.length === 0 && (
                    <>
                      <option value="user">Usuario</option>
                      <option value="moderator">Moderador</option>
                      <option value="admin">Admin</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Teléfono</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Activity className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={isActive ? 'active' : 'inactive'}
                  onChange={(e) => setIsActive(e.target.value === 'active')}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 appearance-none"
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </div>
              <div className="relative flex-1">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={isVerified ? 'verified' : 'unverified'}
                  onChange={(e) => setIsVerified(e.target.value === 'verified')}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 appearance-none"
                >
                  <option value="verified">Verificado</option>
                  <option value="unverified">No verificado</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 disabled:opacity-50 transition-all"
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
