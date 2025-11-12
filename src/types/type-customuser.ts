

export  interface CustomUser {
  id: number;
  username: string;
  rol?: Rol | null;
}


export interface Administrador {
  id: number;
  usuario: number; // La clave foránea al ID del usuario
}
export  type EstadoPedido = 'PENDIENTE' | 'EN_CAMINO' | 'ENTREGADO' | 'CANCELADO';






export type CreateUserDto = {
  username: string
  password: string
  rol: number | null
}

export type UpdateUserDto = {
  username?: string
  password: string
  rol?: number | null
}

export type Sexo = 'M' | 'F' | null;

// --- INTERFACES PARA LOS MODELOS DEL BACKEND ---

/**
 * Representa el modelo 'Rol' del backend.
 */
export interface RolApi {
  id: number;
  nombre: string;
}

/**
 * Representa el modelo 'Telefono' del backend.
 * Este modelo está relacionado con el usuario.
 */
export interface TelefonoApi {
  id: number;
  numero: string;
  tipo: string;
  usuario: number; // El ID del usuario al que pertenece
}

/**
 * Representa el modelo 'Usuario' del backend.
 * Contiene los campos del modelo base y sus relaciones.
 */
export interface UsuarioApi {
  id: number;
  username: string; // Django's default 'username' field
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  sexo: Sexo;
  email: string | null;
  password?: string; // Es opcional en algunas operaciones (ej: actualización)
  direccion: string | null;
  fecha_nacimiento: string | null; // Las fechas se manejan como strings ISO en la API
  
  // Relaciones
  rol: RolApi | null; // Asumimos que la API devuelve el objeto Rol completo
  telefonos?: TelefonoApi[] | null; // 'telefonos' es una relación inversa
}

/**
 * Representa el modelo 'Administrador' del backend cuando se crea o edita.
 * No incluye los campos de usuario, solo los específicos del administrador,
 * y se vincula al usuario a través de su ID.
 */
export interface AdministradorApi {
  usuario: number; // El ID del usuario asociado
  numero_licencia: string;
  fecha_certificacion: string;
  empresa: string | null;
  activo: boolean;
}

/**
 * Representa la respuesta de la API al obtener un 'Administrador'
 * con los detalles completos del usuario.
 */
export interface AdministradorDetalle {
  id: number; // La clave primaria del modelo Administrador
  usuario: UsuarioApi; // El objeto Usuario completo
  numero_licencia: string;
  fecha_certificacion: string;
  empresa: string | null;
  activo: boolean;
}

export interface Rol {
  id: number;
  nombre: string;
}

/**
 * Interfaz para el modelo de Usuario.
 * Refleja la estructura de los datos del usuario devueltos por la API.
 */
export interface Usuario {
  id: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  sexo: string;
  username: string; // <-- Add this line
  email: string;
  rol: Rol; // El rol del usuario es un objeto
}
export interface Inquilino {
  id: number;
  usuario: Usuario;
  fecha_inicio_contrato: string;
  fecha_fin_contrato: string;
}
