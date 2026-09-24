'use client'

import { Component, type ReactNode, type ErrorInfo } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
    this.props.onError?.(error, errorInfo)
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
        <div className="bg-glass p-6 rounded-xl border border-alert-red/20 h-full flex flex-col items-center justify-center text-center min-h-[200px]" role="alert">
          <div className="w-12 h-12 rounded-full bg-alert-red/10 flex items-center justify-center mb-4" aria-hidden="true">
            <svg
              className="w-6 h-6 text-alert-red"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="font-display text-lg text-white mb-2">Something went wrong</h3>
          <p className="text-gray-400 text-sm mb-4 max-w-md">
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            type="button"
            onClick={this.handleRetry}
            className="px-4 py-2 bg-solar-orange/20 text-solar-orange rounded-lg text-sm font-display hover:bg-solar-orange/30 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-solar-orange"
          >
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
