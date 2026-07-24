import { Component, ErrorInfo, ReactNode } from 'react'
import { ErrorMessage } from '../ui'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary capto:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }
      return (
        <ErrorMessage
          title="Error de seccion"
          message={this.state.error?.message || 'Algo salio mal en esta seccion.'}
          onRetry={this.handleRetry}
        />
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
