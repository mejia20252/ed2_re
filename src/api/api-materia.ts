import axios from '../app/axiosInstance'; // Asumo que axiosInstance está en esa ruta
import { type Materia } from '../types/type-materia';
import { type MateriaFormState } from '../schemas/schema-materia';

const API_URL = '/materias/'; // Endpoint base de tu API de Laravel

/**
 * Obtiene todas las materias.
 */
export const fetchMaterias = async (): Promise<Materia[]> => {
  const { data } = await axios.get<Materia[]>(API_URL);
  return data;
};

/**
 * Obtiene una sola materia por su ID.
 */
export const fetchMateria = async (id: number): Promise<Materia> => {
  const { data } = await axios.get<Materia>(`${API_URL}${id}/`);
  return data;
};

/**
 * Crea una nueva materia.
 * Nota: El DTO (Data Transfer Object) es el FormState.
 */
export const createMateria = async (dto: MateriaFormState): Promise<Materia> => {
  const { data } = await axios.post<Materia>(API_URL, dto);
  return data;
};

/**
 * Actualiza una materia existente por su ID.
 */
export const updateMateria = async (id: number, dto: MateriaFormState): Promise<Materia> => {
  const { data } = await axios.put<Materia>(`${API_URL}${id}/`, dto);
  return data;
};

/**
 * Elimina una materia por su ID.
 */
export const deleteMateria = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}${id}/`);
};
