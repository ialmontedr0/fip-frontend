import { RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { HelmetProvider } from 'react-helmet-async'
import { queryClient } from '@/lib/query-client'
import { router } from '@/routes'
import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'

function App() {
  const { setLoading } = useAuthStore()

  useEffect(() => {
    setLoading(false)
  }, [setLoading])

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--color-surface)',
              color: 'var(--color-text)',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#22c55e', secondary: '#ffffff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#ffffff' },
              duration: 6000,
            },
          }}
        />
      </QueryClientProvider>
    </HelmetProvider>
  )
}

export default App
