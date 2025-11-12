/** 11. BITACORA */
import axios from '../app/axiosInstance'
import type {
  Bitacora
} from '../types/type-bitacora1'

export interface BitacoraDto {
  login: string
  logout?: string | null
  usuario: number
  ip?: string
  device?: string
}
export const fetchBitacoras = async (): Promise<Bitacora[]> => {
  const { data } = await axios.get<Bitacora[]>('/bitacoras/')
  return data
}
export const fetchBitacora = async (id: number): Promise<Bitacora> => {
  const { data } = await axios.get<Bitacora>(`/bitacoras/${id}/`)
  return data
}
export const createBitacora = async (b: BitacoraDto): Promise<Bitacora> => {
  const { data } = await axios.post<Bitacora>('/bitacoras/', b)
  return data
}
export const updateBitacora = async (id: number, b: BitacoraDto): Promise<Bitacora> => {
  const { data } = await axios.put<Bitacora>(`/bitacoras/${id}/`, b)
  return data
}
export const partialUpdateBitacora = async (id: number, patch: Partial<BitacoraDto>): Promise<Bitacora> => {
  const { data } = await axios.patch<Bitacora>(`/bitacoras/${id}/`, patch)
  return data
}
export const deleteBitacora = async (id: number): Promise<void> => {
  await axios.delete(`/bitacoras/${id}/`)
}
