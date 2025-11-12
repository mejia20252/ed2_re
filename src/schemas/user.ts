// src/schemas/user.ts

import { z } from "zod";

// === Campos comunes obligatorios ===
const commonFields = {
  username: z.string().min(1, "El nombre de usuario es obligatorio").trim(),
  nombre: z.string().min(1, "El nombre es obligatorio").trim(),
  apellido_paterno: z.string().min(1, "El apellido paterno es obligatorio").trim(),
  apellido_materno: z.string().min(1, "El apellido materno es obligatorio").trim(),
  sexo: z.enum(["M", "F"]).nullable().optional(), // Acepta M, F o null
  email: z.string().email("Email inválido").nullable().optional().or(z.literal("")), // Accept empty string for optional fields
  fecha_nacimiento: z.string().nullable().optional().or(z.literal("")), // Fecha en formato ISO (YYYY-MM-DD), also accept empty string
  direccion: z.string().nullable().optional().or(z.literal("")), // Also accept empty string
};

export const userSchema = z.object({
  // Comunes
  ...commonFields,

  // Password for creation, optional for edit
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .optional()
    .or(z.literal("")), // Allow empty string for optional password field
  
  // Confirm password, optional for edit
  confirm: z
    .string()
    .optional()
    .or(z.literal("")), // Allow empty string for confirmation field

  // Rol (número para enviar al backend)
  rol: z.number().int().positive("Debe seleccionar un rol").nullable(),

})
// ✅ VALIDACIÓN: Si se proporciona password, confirm debe coincidir
.refine(
  (data) => {
    // Only validate if password or confirm is not empty
    if ((data.password !== undefined && data.password !== "") || (data.confirm !== undefined && data.confirm !== "")) {
      return data.password === data.confirm;
    }
    return true; // No password provided, so no confirmation needed
  },
  {
    message: "Las contraseñas no coinciden",
    path: ["confirm"],
  }
);

// We need a specific type for the form state that includes `confirm`
// and potentially optional passwords for editing scenarios.
export type UserFormState = z.infer<typeof userSchema>;