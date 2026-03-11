import { Component, type ErrorInfo, type ReactNode } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <AlertTriangle className="mb-4 size-12 text-red-400" />
          <h3 className="text-h3 font-semibold text-foreground">
            Something went wrong
          </h3>
          <p className="mt-2 max-w-sm text-body text-muted-foreground">
            An unexpected error occurred. Please try again.
          </p>
          <Button variant="primary" className="mt-6" onClick={this.handleRetry}>
            <RefreshCw className="mr-2 size-4" />
            Try Again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

export { ErrorBoundary }
