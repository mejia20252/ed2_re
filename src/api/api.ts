// src/api/api.ts
import axios from '../app/axiosInstance'
import type {
  CustomUser,
  UpdateUserDto, CreateUserDto
} from '../types/type-customuser'


export function createUsuario(dto: CreateUserDto) {
  return axios.post('/usuarios/', dto)
}
export const fetchUsuarios = async (): Promise<CustomUser[]> => {
  const { data } = await axios.get<CustomUser[]>('/usuarios/')
  return data
}
export const fetchUsuario = async (id: number): Promise<CustomUser> => {
  const { data } = await axios.get<CustomUser>(`/usuarios/${id}/`)
  return data
}

export const updateUsuario = async (id: number, u: UpdateUserDto): Promise<CustomUser> => {
  const { data } = await axios.put<CustomUser>(`/usuarios/${id}/`, u)
  return data
}
export const partialUpdateUsuario = async (id: number, patch: Partial<UpdateUserDto>): Promise<CustomUser> => {
  const { data } = await axios.patch<CustomUser>(`/usuarios/${id}/`, patch)
  return data
}
export const deleteUsuario = async (id: number): Promise<void> => {
  await axios.delete(`/usuarios/${id}/`)
}

