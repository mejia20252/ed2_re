// src/app/axiosInstance.ts
import axios, { AxiosError } from 'axios'
import type { AxiosRequestConfig } from 'axios'
import { toast } from 'react-toastify'
import { toUiError } from '../api/error'
import { navigateTo } from './navigator'

const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'
const stripe = import.meta.env.VITE_STRIPE_PUBLIC_KEY
console.log('base url is',baseURL)
console.log('etrip es',stripe)
const api = axios.create({ baseURL })

// —— Request: adjuntar access token ——a
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('access')
  if (token && cfg.headers) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

// —— Refresh simple anti-loop ——
let isRefreshing = false
let pending: Array<(token: string | null) => void> = []
const onRefreshed = (token: string | null) => {
  pending.forEach(cb => cb(token))
  pending = []
}

async function tryRefreshToken(): Promise<string | null> {
  if (isRefreshing) {
    return new Promise((resolve) => { pending.push(resolve) })
  }
  isRefreshing = true
  try {
    const refresh = localStorage.getItem('refresh')
    if (!refresh) return null

    // Usa axios "crudo" (sin interceptores) para evitar loops
    const { data } = await axios.post(`${baseURL}/token/refresh/`, { refresh }, {
      validateStatus: s => s >= 200 && s < 300
    })

    const newAccess: string | undefined  = data?.access
    const newRefresh: string | undefined = data?.refresh   // <-- si ROTATE_REFRESH_TOKENS=True, vendrá

    if (newAccess) {
      localStorage.setItem('access', newAccess)
      if (newRefresh) {
        localStorage.setItem('refresh', newRefresh)        // <-- guarda el refresh rotado
      }
      onRefreshed(newAccess)
      return newAccess
    }
    return null
  } catch {
    onRefreshed(null)
    return null
  } finally {
    isRefreshing = false
  }
}

// 👉 Helper para saber si la URL es de autenticación (login/refresh)
const isAuthURL = (u: string) => {
  // Ajusta los fragmentos según tus rutas reales
  // Cobremos: /api/token/, /token/, /login, /token/refresh/
  return u.includes('/api/token') || u.includes('/token/refresh') || u.endsWith('/token/') || u.includes('/login')
}

// —— Response: manejo de errores + refresh ——
api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const original = error.config as (AxiosRequestConfig & { _retry?: boolean })
    const ui = toUiError(error)
    const status = ui.status
    const url = (original?.url || '').toLowerCase()
    const hadToken = !!localStorage.getItem('access')

    // ⛔️ 401 en login/refresh: que lo maneje el formulario (no navegar, no limpiar)
    if (status === 401 && isAuthURL(url)) {
      // Aquí NO intentamos refresh, NI navegamos: sólo devolvemos el error
      return Promise.reject(error)
    }

    // ✅ 401 en endpoints protegidos: intenta refresh 1 vez
    if (status === 401 && !original?._retry) {
      const newAccess = await tryRefreshToken()
      if (newAccess) {
        original._retry = true
        original.headers = { ...(original.headers || {}), Authorization: `Bearer ${newAccess}` }
        return api(original) // reintenta
      }

      // refresh falló. Si teníamos sesión, cerramos “visual” y vamos a /login.
      if (hadToken) {
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        toast.info('Tu sesión expiró. Vuelve a iniciar sesión.')
        navigateTo('/login', { replace: true })
      }
      return Promise.reject(error)
    }

    // 403, 404, 5xx → navegación/mensajes
    if (status === 403) {
      navigateTo('/forbidden', { replace: true })
    } else if (status === 404) {
      navigateTo('/not-found', { replace: true })
    } else if (status && status >= 500) {
      toast.error('Error del servidor. Intenta más tarde.')
    } else if (ui.message) {
      // Para otros errores que quieras toastear globalmente:
      // toast.error(ui.message)
    }

    return Promise.reject(error)
  }
)

export default api
