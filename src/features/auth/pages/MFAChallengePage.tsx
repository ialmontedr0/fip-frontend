import { useState, useRef, useEffect, type KeyboardEvent, type ClipboardEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Button from '@/components/ui/Button'
import { useMFAVerify } from '../hooks/useAuth'

const CODE_LENGTH = 6

function MFAChallengePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const mfaToken = (location.state as { mfa_token?: string })?.mfa_token
  const verifyMutation = useMFAVerify()
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (!mfaToken) {
      navigate('/login', { replace: true })
    }
  }, [mfaToken, navigate])

  if (!mfaToken) {
    return null
  }

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const digit = value.slice(-1)
    const newDigits = [...digits]
    newDigits[index] = digit
    setDigits(newDigits)

    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH)
    const newDigits = Array(CODE_LENGTH).fill('')
    for (let i = 0; i < pastedData.length; i++) {
      newDigits[i] = pastedData[i]
    }
    setDigits(newDigits)
    const nextEmpty = newDigits.findIndex((d) => !d)
    const focusIndex = nextEmpty === -1 ? CODE_LENGTH - 1 : nextEmpty
    inputRefs.current[focusIndex]?.focus()
  }

  const handleSubmit = () => {
    const code = digits.join('')
    if (code.length !== CODE_LENGTH) return
    verifyMutation.mutate({ mfa_token: mfaToken, code })
  }

  const isComplete = digits.every((d) => d !== '')

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Autenticacion de Dos Factores
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Ingresa el codigo de 6 digitos de tu app de autenticacion
        </p>
      </div>

      <div className="flex justify-center gap-2">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            className="h-12 w-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-center text-lg font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            autoFocus={index === 0}
          />
        ))}
      </div>

      <Button
        onClick={handleSubmit}
        className="w-full"
        disabled={!isComplete}
        isLoading={verifyMutation.isPending}
      >
        Verificar
      </Button>
    </div>
  )
}

export default MFAChallengePage
