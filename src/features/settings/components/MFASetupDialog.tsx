import { useState, useEffect } from 'react'
import { X, Key, Copy, Check, Loader2, Smartphone } from 'lucide-react'
import toast from 'react-hot-toast'
import { useEnableMFA } from '../hooks/useSettings'
import { Input, Button } from '@/components/ui'

interface MFASetupDialogProps {
  onClose: () => void
}

export default function MFASetupDialog({ onClose }: MFASetupDialogProps) {
  const enableMFA = useEnableMFA()
  const [step, setStep] = useState<'loading' | 'setup' | 'verify'>('loading')
  const [secret, setSecret] = useState('')
  const [qrCode, setQrCode] = useState('')
  const [code, setCode] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    enableMFA.mutate(undefined, {
      onSuccess: (data) => {
        setSecret(data.secret)
        setQrCode(data.qr_code_base64)
        setStep('setup')
      },
      onError: () => onClose(),
    })
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(secret)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white dark:bg-gray-900 shadow-2xl animate-fade-in-up">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600">
              <Smartphone className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Configurar MFA</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="h-4 w-4 text-gray-400" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {step === 'loading' && (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          )}

          {step === 'setup' && (
            <>
              <div className="text-center space-y-2">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Escanea el código QR</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Usa Google Authenticator o cualquier app TOTP
                </p>
              </div>

              <div className="flex justify-center">
                {qrCode && (
                  <img
                    src={`data:image/png;base64,${qrCode}`}
                    alt="MFA QR Code"
                    className="rounded-xl border border-gray-200 dark:border-gray-700 w-48 h-48"
                  />
                )}
              </div>

              <div className="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-4 space-y-3">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  O ingresa manualmente
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs font-mono bg-white dark:bg-gray-700 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 select-all">
                    {secret}
                  </code>
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    title="Copiar"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-gray-400" />}
                  </button>
                </div>
              </div>

              <Button
                onClick={() => setStep('verify')}
                className="w-full"
              >
                Continuar
              </Button>
            </>
          )}

          {step === 'verify' && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <div className="flex justify-center mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20">
                    <Key className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Verifica el código</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Ingresa el código de 6 dígitos generado por la app
                </p>
              </div>

              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="text-center text-2xl tracking-[0.5em] font-mono"
              />

              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    onClose()
                    toast.success('MFA activado correctamente')
                  }}
                  disabled={code.length !== 6}
                  className="flex-1"
                >
                  Verificar
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
