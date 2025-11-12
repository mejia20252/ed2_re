
import { createRoot } from 'react-dom/client'
import './index.css';import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'
import AppErrorBoundary from './components/AppErrorBoundary'
createRoot(document.getElementById('root')!).render(
  <AppErrorBoundary>
    <AuthProvider>
        <ToastContainer position="top-right" autoClose={5000} />
        <App />
    </AuthProvider>
  </AppErrorBoundary>
)
