// src/schemas/telefono.ts
import { z } from "zod";

// Esquema de validación para los datos enviados a la API
export const telefonoSchema = z.object({
  numero: z.string().min(1, "El número de teléfono es obligatorio").max(20, "Máximo 20 caracteres").trim(),
  tipo: z.string().min(1, "El tipo de teléfono es obligatorio").max(50, "Máximo 50 caracteres").trim(),
  usuario: z.number().min(1, "El ID de usuario es obligatorio"),
});

// Esquema para el formulario de React Hook Form
export const telefonoFormSchema = z.object({
  numero: z.string().min(1, "El número de teléfono es obligatorio").max(20, "Máximo 20 caracteres").trim(),
  tipo: z.string().min(1, "El tipo de teléfono es obligatorio").max(50, "Máximo 50 caracteres").trim(),
  usuario: z.string().min(1, "El ID de usuario es obligatorio").regex(/^\d+$/, "El ID de usuario debe contener solo números"),
});

export type TelefonoFormState = z.infer<typeof telefonoFormSchema>;
export type TelefonoApiState = z.infer<typeof telefonoSchema>;