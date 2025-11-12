export interface Aula {
    id: number;
    nombre: string;
    capacidad: number;
    ubicacion: string;
    codigo:string;
    estado: 'Disponible' | 'Ocupada' | 'Mantenimiento';
}
