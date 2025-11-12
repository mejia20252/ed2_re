// src/contexts/AuthContext.tsx
import { useEffect } from 'react';
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { type Rol } from '../types/type-rol'
import { login, logoutAPI, setEncabezado, refreshAccess } from '../api/auth';
import axiosInstance from '../app/axiosInstance';

interface CustomUser {
    id: number;
    username: string;
    nombre: string;
    apellido_paterno: string;
    apellido_materno: string;
    email: string;
    direccion: string | null;
    fecha_nacimiento: string | null;
    rol: Rol;
    sexo?: string | null;
}

interface AuthContextType {
    user: CustomUser | null;
    signin: (u: string, p: string) => Promise<CustomUser>;
    signout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<CustomUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const signin = async (username: string, password: string): Promise<CustomUser> => {
        // ✅ Login devuelve todo incluyendo el usuario
        const response = await login(username, password);
        
        // ✅ Guardar token
        setEncabezado(response.access_token);
        localStorage.setItem('access_token', response.access_token);
        
                // 2) Recupera datos completos del usuario (incluye role.name)
        const { data: me } = await axiosInstance.get<CustomUser>('/usuarios/me/');
        console.log('este es el usuario',me)
        setUser(me);
        
        return me;
    };

    useEffect(() => {
        const token = localStorage.getItem('access_token');
    
        if (!token) {
            setLoading(false);
            return;
        }
        
        setEncabezado(token);
        
        // ✅ Cargar usuario desde /usuarios/me
        axiosInstance
            .get<CustomUser>('/usuarios/me')
            .then(({ data }) => setUser(data))
            .catch(async (error) => {
                // ✅ Intentar refresh si el token expiró
                if (error.response?.status === 401) {
                    try {
                        const refreshResponse = await refreshAccess();
                        setEncabezado(refreshResponse.access_token);
                        localStorage.setItem('access_token', refreshResponse.access_token);
                        
                        // Reintentar obtener usuario
                        const { data } = await axiosInstance.get<CustomUser>('/usuarios/me');
                        setUser(data);
                    } catch {
                        // Si falla el refresh, cerrar sesión
                        localStorage.removeItem('access_token');
                        setUser(null);
                    }
                } else {
                    localStorage.removeItem('access_token');
                    setUser(null);
                }
            })
            .finally(() => setLoading(false));
    }, []);

    const signout = async () => {
        try {
            // ✅ Laravel logout no necesita parámetros
            await logoutAPI();
        } catch (err) {
            console.error('Error al cerrar sesión:', err);
        }

        // Limpiar todo
        localStorage.removeItem('access_token');
        delete axiosInstance.defaults.headers.common.Authorization;
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, signin, signout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);