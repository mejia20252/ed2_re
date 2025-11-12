// src/types/user.ts


export interface CustomUserResponse {
  id: number;
  username: string;
  email: string | null;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  sexo: 'M' | 'F' | null;
  direccion: string | null;
  fecha_nacimiento: string | null;
  rol: number; // <-- sigue siendo el ID del rol (para consistencia con el payload de escritura)
  rol_nombre: string | null; // <-- ¡Nuevo campo! Solo para lectura
}

export interface CreateUserPayload {
  username: string;
  password?: string; // Make password optional for updates
  email?: string | null;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  sexo?: 'M' | 'F' | null;
  direccion?: string | null;
  fecha_nacimiento?: string | null;
  rol: number; // Solo el ID del rol
}

// UserFormState for client-side form management (includes confirm password)
export interface UserFormState extends Omit<CreateUserPayload, 'password' | 'rol'> {
  password?: string; // Optional for edit, required for create
  confirm?: string; // Used for client-side password confirmation
  rol: number | null; // Can be null if not selected yet
}