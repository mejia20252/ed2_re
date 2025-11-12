import { z } from "zod";

export const aulaSchema = z.object({
    codigo: z.string().min(1, "El código es obligatorio"),
    nombre: z.string().min(1, "El nombre es obligatorio"),
    capacidad: z.number().min(0, "La capacidad no puede ser negativa"),
    ubicacion: z.string().min(1, "La ubicación es obligatoria"),
    estado: z.enum(['Disponible', 'Ocupada', 'Mantenimiento'], "Estado no válido"),
});

export type AulaFormState = z.infer<typeof aulaSchema>;
