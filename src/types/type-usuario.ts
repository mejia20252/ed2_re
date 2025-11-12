import {type Rol } from './type-rol'

// Interfaz para el objeto principal (usuario)
export interface Usuario {
    id: number;
    nombre: string;
    username: string;
    email: string;
    apellido_paterno: string;
    apellido_materno: string;
    sexo: string;
    direccion: string;
    fecha_nacimiento: string; // Puedes cambiar a tipo Date si prefieres manejar fechas
    rol: Rol | null; // El rol puede ser null, en algunos casos
}
