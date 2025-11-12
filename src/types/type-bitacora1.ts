
export interface Bitacora {
  id: number;
  login: string; // ISO string de fecha y hora
  logout: string | null; // ISO string de fecha y hora, puede ser null
  usuario: CustomUser; // ¡Aquí está el cambio clave! El objeto usuario completo
  ip: string | null;
  device: string | null;
  // Si tienes DetalleBitacora, también podrías anidarlo aquí si el serializer lo permitiera
  // detallebitacoras?: DetalleBitacora[];
}

// Puedes mantener CustomUser como lo tienes, o simplificarlo si solo necesitas unos pocos campos
// type-customuser.ts
export interface Rol {
  id: number;
  nombre: string;
}

export interface CustomUser {
  id: number;
  username: string;
  email: string | null;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  sexo: string | null;
  direccion: string | null;
  fecha_nacimiento: string | null; // o Date
  rol: Rol;
  // Otros campos que tu UsuarioSerializer exponga
}