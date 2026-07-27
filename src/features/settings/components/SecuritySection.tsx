import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Shield, Smartphone, Key } from 'lucide-react'
import { useProfile, useDisableMFA } from '../hooks/useSettings'
import { Input, Button } from '@/components/ui'
import MFASetupDialog from './MFASetupDialog'
import SessionsList from './SessionsList'

export default function SecuritySection() {
  const { data: profile } = useProfile()
  const disableMFA = useDisableMFA()
  const [showMFASetup, setShowMFASetup] = useState(false)
  const [mfaDisableCode, setMfaDisableCode] = useState('')
  const [showDisableConfirm, setShowDisableConfirm] = useState(false)

  const handleDisableMFA = async () => {
    await disableMFA.mutateAsync({ code: mfaDisableCode })
    setMfaDisableCode('')
    setShowDisableConfirm(false)
  }

  return (
    <div className="space-y-6">
      {/* Password Section */}
      <div className="rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20">
            <Key className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Contrase&ntilde;a</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Cambia tu contrase&ntilde;a peri&oacute;dicamente
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Para cambiar tu contrase&ntilde;a, usa la opci&oacute;n "Olvid&eacute; mi contrase&ntilde;a" en la pantalla de inicio de sesi&oacute;n.
          Recibir&aacute;s un enlace en tu correo para restablecerla.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.href = '/reset-password'}
        >
          <Key className="h-3.5 w-3.5 mr-1.5" />
          Restablecer Contrase&ntilde;a
        </Button>
      </div>

      {/* MFA Section */}
      <div className="rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className={cn(
              'flex h-10 w-10 items-center justify-center rounded-xl',
              profile?.mfa_enabled
                ? 'bg-gradient-to-br from-emerald-500/20 to-green-500/20'
                : 'bg-gradient-to-br from-gray-500/20 to-gray-400/20',
            )}>
              <Smartphone className={cn(
                'h-5 w-5',
                profile?.mfa_enabled ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400',
              )} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Autenticaci&oacute;n en Dos Factores
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {profile?.mfa_enabled
                  ? 'MFA est&aacute; activo. Se requiere c&oacute;digo TOTP al iniciar sesi&oacute;n.'
                  : 'A&ntilde;ade una capa extra de seguridad a tu cuenta.'}
              </p>
            </div>
          </div>
          {profile?.mfa_enabled ? (
            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
              <Shield className="h-3 w-3" />
              ACTIVO
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
              INACTIVO
            </span>
          )}
        </div>

        {profile?.mfa_enabled ? (
          <div className="space-y-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Para deshabilitar MFA, ingresa un c&oacute;digo de 6 d&iacute;gitos desde tu app TOTP.
            </p>
            {showDisableConfirm ? (
              <div className="flex items-center gap-2">
                <Input
                  value={mfaDisableCode}
                  onChange={(e) => setMfaDisableCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="w-32 text-center font-mono text-lg tracking-widest"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDisableConfirm(false)}
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={handleDisableMFA}
                  disabled={mfaDisableCode.length !== 6}
                  isLoading={disableMFA.isPending}
                >
                  Deshabilitar
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDisableConfirm(true)}
              >
                Deshabilitar MFA
              </Button>
            )}
          </div>
        ) : (
          <Button size="sm" onClick={() => setShowMFASetup(true)}>
            <Smartphone className="h-3.5 w-3.5 mr-1.5" />
            Configurar MFA
          </Button>
        )}
      </div>

      {showMFASetup && (
        <MFASetupDialog onClose={() => setShowMFASetup(false)} />
      )}

      {/* Sessions */}
      <div className="rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20">
            <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Sesiones Activas</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Dispositivos con acceso a tu cuenta
            </p>
          </div>
        </div>
        <SessionsList />
      </div>
    </div>
  )
}
