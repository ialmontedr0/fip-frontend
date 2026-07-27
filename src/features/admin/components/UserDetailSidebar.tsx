import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { ArrowLeft, Mail, Shield, Calendar, Activity, Phone, Smartphone, Fingerprint, Clock, Edit3 } from 'lucide-react'
import { useAdminRoles, useAdminUser } from '../hooks/useAdmin'
import UserRoleSelect from './UserRoleSelect'
import UserStatusToggle from './UserStatusToggle'
import EditUserModal from './EditUserModal'

interface UserDetailSidebarProps {
  userId: string
}

export default function UserDetailSidebar({ userId }: UserDetailSidebarProps) {
  const navigate = useNavigate()
  const { data: user, isLoading } = useAdminUser(userId)
  const { data: rolesData } = useAdminRoles()
  const [showEdit, setShowEdit] = useState(false)

  const role = rolesData?.roles.find((r) => r.name === user?.role)

  if (isLoading || !user) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate('/admin/users')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 transition-all"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Volver a usuarios
        </button>
        <div className="rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-6 shadow-sm animate-pulse">
          <div className="flex flex-col items-center mb-6">
            <div className="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-700 mb-3" />
            <div className="h-5 w-40 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-14 rounded-xl bg-gray-100 dark:bg-gray-800/50" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {showEdit && <EditUserModal userId={userId} open={showEdit} onClose={() => setShowEdit(false)} />}
      <div className="space-y-6">
        <button
          onClick={() => navigate('/admin/users')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 transition-all"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Volver a usuarios
        </button>

        <div className="rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-6 shadow-sm">
          {/* Avatar + Edit */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-2xl font-bold text-white shadow-xl shadow-purple-500/30 mb-3">
                {user.email[0].toUpperCase()}
              </div>
              <button
                onClick={() => setShowEdit(true)}
                className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700 transition-all"
              >
                <Edit3 className="h-3.5 w-3.5" />
              </button>
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{user.email}</h2>
            <span className={cn(
              'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold mt-1',
              role?.is_system
                ? 'bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
            )}>
              {role?.display_name || user.role}
            </span>
          </div>

          {/* Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 p-3">
              <Mail className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase">Email</p>
                <p className="text-xs font-medium text-gray-900 dark:text-white">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 p-3">
              <Phone className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase">Teléfono</p>
                <p className="text-xs font-medium text-gray-900 dark:text-white">{user.phone || 'No registrado'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 p-3">
              <Shield className="h-4 w-4 text-gray-400" />
              <div className="flex-1">
                <p className="text-[10px] font-semibold text-gray-400 uppercase">Rol</p>
                <UserRoleSelect userId={user.id} currentRole={user.role} />
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 p-3">
              <Activity className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase">Estado</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <UserStatusToggle userId={user.id} isActive={user.is_active} />
                  <span className={cn(
                    'text-xs font-semibold',
                    user.is_active ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500',
                  )}>
                    {user.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 p-3">
              <Smartphone className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase">Verificado</p>
                <span className={cn(
                  'text-xs font-semibold',
                  user.is_verified ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400',
                )}>
                  {user.is_verified ? 'Sí' : 'No'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 p-3">
              <Fingerprint className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase">MFA</p>
                <span className={cn(
                  'text-xs font-semibold',
                  user.mfa_enabled ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400',
                )}>
                  {user.mfa_enabled ? 'Activado' : 'Desactivado'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 p-3">
              <Clock className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase">Último acceso</p>
                <p className="text-xs font-medium text-gray-900 dark:text-white">
                  {user.last_login_at
                    ? new Date(user.last_login_at).toLocaleDateString('es-DO', {
                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
                      })
                    : 'Nunca'}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-gray-50 dark:bg-gray-800/50 p-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <p className="text-[10px] font-semibold text-gray-400 uppercase">Creado</p>
              </div>
              <p className="text-xs font-medium text-gray-900 dark:text-white">
                {new Date(user.created_at).toLocaleDateString('es-DO', {
                  year: 'numeric', month: 'short', day: 'numeric',
                })}
              </p>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-gray-50 dark:bg-gray-800/50 p-3">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-gray-400" />
                <p className="text-[10px] font-semibold text-gray-400 uppercase">Inicios de sesión</p>
              </div>
              <span className="text-xs font-bold text-gray-900 dark:text-white">{user.login_count}</span>
            </div>
          </div>

          <button
            onClick={() => setShowEdit(true)}
            className="mt-4 w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
          >
            <Edit3 className="h-4 w-4" />
            Editar Usuario
          </button>
        </div>
      </div>
    </div>
  )
}
