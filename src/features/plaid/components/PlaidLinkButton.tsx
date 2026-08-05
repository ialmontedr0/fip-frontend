import { usePlaidLink } from 'react-plaid-link'
import { useState } from 'react'
import { Landmark } from 'lucide-react'
import { useLinkToken, useExchangeToken } from '../hooks/usePlaid'

interface Props {
  onSuccess?: () => void
}

export default function PlaidLinkButton({ onSuccess }: Props) {
  const linkTokenMutation = useLinkToken()
  const exchangeMutation = useExchangeToken()
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const open = usePlaidLink({
    token,
    onSuccess: async (publicToken) => {
      if (!publicToken) return
      await exchangeMutation.mutateAsync(publicToken)
      onSuccess?.()
    },
    onExit: () => {
      setToken(null)
      setLoading(false)
    },
  })

  const handleClick = async () => {
    setLoading(true)
    try {
      const { link_token } = await linkTokenMutation.mutateAsync()
      if (!link_token) {
        setLoading(false)
        return
      }
      setToken(link_token)
      open.open()
    } catch {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading || open.error !== null}
      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl hover:from-violet-600 hover:to-purple-700 disabled:opacity-50"
    >
      <Landmark className="h-4 w-4" />
      {loading ? 'Conectando...' : 'Vincular cuenta bancaria'}
    </button>
  )
}
