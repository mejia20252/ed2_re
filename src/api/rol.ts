/** 3. ROL */
import type {
  Rol
} from '../types/type-rol'

import axios from '../app/axiosInstance'

export interface RolDto {
  nombre: string
}
export const fetchRoles = async (): Promise<Rol[]> => {
  const { data } = await axios.get<Rol[]>('/roles/')
  return data
}
export const fetchRol = async (id: number): Promise<Rol> => {
  const { data } = await axios.get<Rol>(`/roles/${id}/`)
  return data
}
export const createRol = async (r: RolDto): Promise<Rol> => {
  const { data } = await axios.post<Rol>('/roles/', r)
  return data
}
export const updateRol = async (id: number, r: RolDto): Promise<Rol> => {
  const { data } = await axios.put<Rol>(`/roles/${id}/`, r)
  return data
}
export const partialUpdateRol = async (id: number, patch: Partial<RolDto>): Promise<Rol> => {
  const { data } = await axios.patch<Rol>(`/roles/${id}/`, patch)
  return data
}
export const deleteRol = async (id: number): Promise<void> => {
  await axios.delete(`/roles/${id}/`)
}
