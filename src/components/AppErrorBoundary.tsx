// src/components/AppErrorBoundary.tsx
import React from 'react'

type Props = { children: React.ReactNode }
type State = { hasError: boolean }

class AppErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(_error: unknown): State {
    return { hasError: true }
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    // En producción manda a Sentry/Datadog; en dev puedes hacer console.error
     console.error(error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 text-center">
          <h1 className="text-3xl font-semibold">Algo salió mal (500)</h1>
          <p className="text-gray-600 mt-2">
            Intenta refrescar la página o vuelve más tarde.
          </p>
        </div>
      )
    }
    return this.props.children
  }
}

export default AppErrorBoundary
