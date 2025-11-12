
// src/api/api.ts
import axios from '../app/axiosInstance'
import type {
   DetalleBitacora
} from '../types/type-detalle-bitacora'

/** 12. DETALLE BITACORA */
export interface DetalleBitacoraDto {
  bitacora: number
  accion: string
  fecha: string
  tabla: string
}
export const fetchDetalleBitacoras = async (): Promise<DetalleBitacora[]> => {
  const { data } = await axios.get<DetalleBitacora[]>('/detalle-bitacoras/')
  return data
}
export const fetchDetalleBitacora = async (id: number): Promise<DetalleBitacora> => {
  const { data } = await axios.get<DetalleBitacora>(`/detalle-bitacoras/${id}/`)
  return data
}
export const createDetalleBitacora = async (d: DetalleBitacoraDto): Promise<DetalleBitacora> => {
  const { data } = await axios.post<DetalleBitacora>('/detalle-bitacoras/', d)
  return data
}
export const updateDetalleBitacora = async (id: number, d: DetalleBitacoraDto): Promise<DetalleBitacora> => {
  const { data } = await axios.put<DetalleBitacora>(`/detalle-bitacoras/${id}/`, d)
  return data
}
export const partialUpdateDetalleBitacora = async (id: number, patch: Partial<DetalleBitacoraDto>): Promise<DetalleBitacora> => {
  const { data } = await axios.patch<DetalleBitacora>(`/detalle-bitacoras/${id}/`, patch)
  return data
}
export const deleteDetalleBitacora = async (id: number): Promise<void> => {
  await axios.delete(`/detalle-bitacoras/${id}/`)
}
