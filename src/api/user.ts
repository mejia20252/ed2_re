// src/api/user.ts

import axiosInstance from '../app/axiosInstance';
import type { CustomUserResponse, CreateUserPayload } from '../types/user';


// ✅ Fetch all users
export const fetchUsers = async (): Promise<CustomUserResponse[]> => {
  const response = await axiosInstance.get<CustomUserResponse[]>('/usuarios/');
  return response.data;
};

// ✅ Fetch single user by ID
export const fetchUser = async (id: number): Promise<CustomUserResponse> => {
  const response = await axiosInstance.get<CustomUserResponse>(`/usuarios/${id}`);
  return response.data;
};

// ✅ Create new user
export const createUser = async (payload: CreateUserPayload): Promise<CustomUserResponse> => {
  // Ensure we only send fields defined in CreateUserPayload
  const cleanPayload = { ...payload };
  // No need to manually delete fields if payload type is correctly inferred
  const response = await axiosInstance.post<CustomUserResponse>('/usuarios/', cleanPayload);
  return response.data;
};

// ✅ Update existing user (partial update allowed)
export const updateUser = async (
  id: number,
  payload: Partial<CreateUserPayload>
): Promise<CustomUserResponse> => {
  // Ensure we only send fields defined in Partial<CreateUserPayload>
  const cleanPayload = { ...payload };
  const response = await axiosInstance.put<CustomUserResponse>(`/usuarios/${id}/`, cleanPayload);
  return response.data;
};

// ✅ Delete user
export const deleteUser = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/usuarios/${id}/`);
};