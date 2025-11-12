import axios from '../app/axiosInstance';
import { type Aula } from '../types/type-aula';

export const fetchAulas = async (): Promise<Aula[]> => {
    const { data } = await axios.get<Aula[]>('/aulas/');
    return data;
};

export const fetchAula = async (id: number): Promise<Aula> => {
    const { data } = await axios.get<Aula>(`/aulas/${id}/`);
    return data;
};

export const createAula = async (dto: Aula): Promise<Aula> => {
    const { data } = await axios.post<Aula>('/aulas/', dto);
    return data;
};

export const updateAula = async (id: number, dto: Aula): Promise<Aula> => {
    const { data } = await axios.put<Aula>(`/aulas/${id}/`, dto);
    return data;
};

export const deleteAula = async (id: number): Promise<void> => {
    await axios.delete(`/aulas/${id}/`);
};
