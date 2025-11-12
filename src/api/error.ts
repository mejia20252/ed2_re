import type { AxiosError } from 'axios'
// arriba de UserList
type UiError = {
  message: string
  fields?: Record<string, string[]>
  status?: number
  code?: string
  file?: string
  line?: number
  exception?: string
  raw?: any              // <- añadimos para ver el JSON crudo del backend
}

export function toUiError(err: unknown): UiError {
  const ax = err as AxiosError<any>

  // Si el error tiene respuesta (es decir, se recibió una respuesta del servidor)
  if (ax?.response) {
    const { status, data } = ax.response
    
    // Caso 1: Errores de validación de Laravel (con "errors")
    if (data?.errors) {
      return {
        message: data.message || 'Error de validación',
        fields: data.errors,  // Laravel devuelve "errors", no "error.fields"
        status,
        code: data.code
      }
    }
    
    // Caso 2: Error con estructura "error" anidada
    if (data?.error) {
      return {
        message: data.error.message || data.message || 'Ocurrió un error inesperado',
        fields: data.error.fields || data.error.errors,
        status,
        code: data.error.code
      }
    }
    
    // Caso 3: Mensaje directo
    if (data?.message) {
      return {
        message: data.message,
        status
      }
    }
    
    // Caso 4: Si la respuesta contiene un detalle
    if (data?.detail) {
      return { 
        message: data.detail,
        status
      }
    }
    
    // Caso 5: Fallback genérico
    return { 
      message: 'Error al procesar la solicitud', 
      status 
    }
  }

  // Si no hay respuesta del servidor pero sí una solicitud
  if (ax?.request) return { message: 'No hay conexión con el servidor' }
  
  // Error desconocido
  return { message: (ax as any)?.message || 'Error desconocido' }
}