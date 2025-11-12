
// schemas/role.ts
import { z } from "zod";

export const roleSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").trim(),
});

export type FormState = z.infer<typeof roleSchema>; // 👈 este será tu tipo del formulario
