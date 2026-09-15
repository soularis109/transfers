import type { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from '@/app/store'
import ErrorBoundary from '@/shared/ui/ErrorBoundary'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter basename={import.meta.env.BASE_URL}>{children}</BrowserRouter>
      </Provider>
    </ErrorBoundary>
  )
}
