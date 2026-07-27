import { useState } from 'react'
import { Loader2, X, Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react'
import { useCreateUser } from '../hooks/useAdmin'
import { useAdminRoles } from '../hooks/useAdmin'

interface CreateUserModalProps {
  open: boolean
  onClose: () => void
}

export default function CreateUserModal({ open, onClose }: CreateUserModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')
  const [phone, setPhone] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { data: rolesData } = useAdminRoles()
  const { mutate: createUser, isPending } = useCreateUser()

  if (!open) return null

  const roles = rolesData?.roles ?? []

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createUser(
      { email, password, role, phone: phone || undefined },
      { onSuccess: () => { onClose(); setEmail(''); setPassword(''); setRole('user'); setPhone('') } },
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white dark:bg-gray-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Crear Usuario</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

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
                placeholder="usuario@ejemplo.com"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Mínimo 8 caracteres"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Rol</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
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
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Teléfono (opcional)</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 809 555 0000"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
              />
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
              {isPending ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Crear Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
