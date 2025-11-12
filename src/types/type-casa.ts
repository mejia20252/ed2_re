// src/types/casa-types.ts

// Tipos base para los objetos anidados
export interface Rol {
  id: number;
  nombre: string;
}

export interface Usuario {
  id: number;
  username: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  email: string;
  rol: Rol;
}

export interface Propietario {
  id: number;
  usuario: Usuario;
  fecha_adquisicion: string | null; // Fecha en formato ISO (string)
}

// Tipo principal: Casa
export interface Casa {
  id: number;
  numero_casa: string;
  tipo_de_unidad: string;
  numero: number;
  area: number;
  propietario: Propietario | null; // Puede ser null si no tiene propietario asignado
}