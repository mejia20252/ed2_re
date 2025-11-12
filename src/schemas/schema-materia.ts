import { z } from "zod";

/**
 * Define el esquema de validación para el formulario de Materia.
 */
export const materiaSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  codigo: z.string().min(1, "El código es obligatorio"),
  
  // Aseguramos que la entrada del formulario se convierta a número
  creditos: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Los créditos no pueden ser negativos")
  ),
  
  hps: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Las 'Horas por Semana' no pueden ser negativas")
  ),
});

/**
 * Exporta el tipo inferido del schema para usar en useForm.
 */
export type MateriaFormState = z.infer<typeof materiaSchema>;
