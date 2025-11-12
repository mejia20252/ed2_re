// src/api/auth.ts
import axiosInstance from '../app/axiosInstance'

interface TokenResponse {
  access_token: string;  
  token_type: string;
  expires_in: number;
  user: any;
}

export async function login(
  username: string,
  password: string
): Promise<TokenResponse> {
  const { data } = await axiosInstance.post<TokenResponse>('/login', { 
    username, 
    password 
  });
  return data;
}

export function setEncabezado(token: string) {
  axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export async function logoutAPI(): Promise<void> {
  await axiosInstance.post('/logout');
}

export async function refreshAccess(): Promise<TokenResponse> {
  const { data } = await axiosInstance.post<TokenResponse>('/refresh');
  return data;
}