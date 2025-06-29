// src/lib/validations.ts
import { z } from 'zod'

// ✅ Esquema de validación para login
export const loginSchema = z.object({
  username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  id_parroquia: z.number().min(1, 'Selecciona una parroquia'),
})

// ✅ Esquema de validación para catequizandos
export const catequizandoSchema = z.object({
  nombres: z.string()
    .min(2, 'Los nombres deben tener al menos 2 caracteres')
    .max(100, 'Los nombres no pueden exceder 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Los nombres solo pueden contener letras y espacios'),
  
  apellidos: z.string()
    .min(2, 'Los apellidos deben tener al menos 2 caracteres')
    .max(100, 'Los apellidos no pueden exceder 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Los apellidos solo pueden contener letras y espacios'),
  
  fecha_nacimiento: z.string()
    .min(1, 'La fecha de nacimiento es requerida')
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const hundredYearsAgo = new Date();
      hundredYearsAgo.setFullYear(today.getFullYear() - 100);
      
      return birthDate < today && birthDate > hundredYearsAgo;
    }, 'La fecha de nacimiento debe ser válida y realista'),
  
  documento_identidad: z.string()
    .min(6, 'El documento debe tener al menos 6 caracteres')
    .max(20, 'El documento no puede exceder 20 caracteres')
    .regex(/^[a-zA-Z0-9\-]+$/, 'El documento solo puede contener letras, números y guiones'),
  
  caso_especial: z.boolean().optional().default(false),
})

// ✅ Esquema de validación para grupos
export const grupoSchema = z.object({
  nombre: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-\.]+$/, 'El nombre contiene caracteres inválidos'),
  
  id_nivel: z.number()
    .min(1, 'Selecciona un nivel válido')
    .int('El ID del nivel debe ser un número entero'),
  
  id_parroquia: z.number()
    .min(1, 'Selecciona una parroquia válida')
    .int('El ID de la parroquia debe ser un número entero'),
  
  periodo: z.string()
    .min(4, 'El periodo es requerido')
    .regex(/^\d{4}(-\d{4})?$/, 'El periodo debe tener formato YYYY o YYYY-YYYY'),
  
  capacidad: z.number()
    .min(1, 'La capacidad debe ser mayor a 0')
    .max(50, 'La capacidad máxima es 50')
    .int('La capacidad debe ser un número entero')
    .optional(),
})

// ✅ Esquema de validación para certificados
export const certificadoSchema = z.object({
  id_catequizando: z.number()
    .min(1, 'Selecciona un catequizando válido')
    .int('El ID del catequizando debe ser un número entero'),
  
  id_nivel: z.number()
    .min(1, 'Selecciona un nivel válido')
    .int('El ID del nivel debe ser un número entero'),
  
  id_parroquia: z.number()
    .min(1, 'Selecciona una parroquia válida')
    .int('El ID de la parroquia debe ser un número entero'),
  
  fecha_emision: z.string()
    .min(1, 'La fecha de emisión es requerida')
    .refine((date) => {
      const emissionDate = new Date(date);
      return !isNaN(emissionDate.getTime());
    }, 'La fecha de emisión debe ser válida'),
  
  aprobado: z.boolean().default(false),
  emitir_inmediatamente: z.boolean().optional().default(false),
})

// ✅ Esquema para usuarios
export const usuarioSchema = z.object({
  username: z.string()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
    .max(50, 'El nombre de usuario no puede exceder 50 caracteres')
    .regex(/^[a-zA-Z0-9_.-]+$/, 'El nombre de usuario solo puede contener letras, números, puntos, guiones y guiones bajos'),
  
  password: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(100, 'La contraseña no puede exceder 100 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La contraseña debe contener al menos una letra minúscula, una mayúscula y un número'),
  
  tipo_perfil: z.enum(['admin', 'parroco', 'secretaria', 'catequista', 'consulta'], {
    errorMap: () => ({ message: 'El tipo de perfil debe ser válido' })
  }),
  
  id_parroquia: z.number()
    .min(1, 'Selecciona una parroquia válida')
    .int('El ID de la parroquia debe ser un número entero')
    .optional(),
})

// ✅ Esquema para parroquias
export const parroquiaSchema = z.object({
  nombre: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-\.]+$/, 'El nombre contiene caracteres inválidos'),
  
  direccion: z.string()
    .min(5, 'La dirección debe tener al menos 5 caracteres')
    .max(255, 'La dirección no puede exceder 255 caracteres'),
  
  telefono: z.string()
    .min(7, 'El teléfono debe tener al menos 7 caracteres')
    .max(20, 'El teléfono no puede exceder 20 caracteres')
    .regex(/^[\d\-\s\+\(\)]+$/, 'Formato de teléfono inválido'),
})

// ✅ Esquema para niveles
export const nivelSchema = z.object({
  nombre: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-\.I]+$/, 'El nombre contiene caracteres inválidos'),
  
  descripcion: z.string()
    .min(5, 'La descripción debe tener al menos 5 caracteres')
    .max(255, 'La descripción no puede exceder 255 caracteres'),
  
  orden: z.number()
    .min(1, 'El orden debe ser mayor a 0')
    .max(20, 'El orden no puede ser mayor a 20')
    .int('El orden debe ser un número entero'),
})

// ✅ Esquema para asistencia
export const asistenciaSchema = z.object({
  id_inscripcion: z.number()
    .min(1, 'ID de inscripción debe ser válido')
    .int('El ID de inscripción debe ser un número entero'),
  
  fecha: z.string()
    .min(1, 'La fecha es requerida')
    .refine((date) => {
      const attendanceDate = new Date(date);
      return !isNaN(attendanceDate.getTime());
    }, 'La fecha debe ser válida'),
  
  asistio: z.boolean(),
})

// ✅ Esquemas de búsqueda y filtros
export const searchSchema = z.object({
  q: z.string()
    .min(2, 'El término de búsqueda debe tener al menos 2 caracteres')
    .max(50, 'El término de búsqueda no puede exceder 50 caracteres')
    .optional(),
  
  page: z.number()
    .min(1, 'La página debe ser mayor a 0')
    .int('La página debe ser un número entero')
    .optional(),
  
  limit: z.number()
    .min(1, 'El límite debe ser mayor a 0')
    .max(100, 'El límite máximo es 100')
    .int('El límite debe ser un número entero')
    .optional(),
})

// ✅ Tipos TypeScript inferidos automáticamente
export type LoginFormData = z.infer<typeof loginSchema>
export type CatequizandoFormData = z.infer<typeof catequizandoSchema>
export type GrupoFormData = z.infer<typeof grupoSchema>
export type CertificadoFormData = z.infer<typeof certificadoSchema>
export type UsuarioFormData = z.infer<typeof usuarioSchema>
export type ParroquiaFormData = z.infer<typeof parroquiaSchema>
export type NivelFormData = z.infer<typeof nivelSchema>
export type AsistenciaFormData = z.infer<typeof asistenciaSchema>
export type SearchFormData = z.infer<typeof searchSchema>

// ✅ Utilidades de validación
export const validateData = <T>(schema: z.ZodSchema<T>, data: unknown): { 
  success: boolean; 
  data?: T; 
  errors?: z.ZodError 
} => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
}

// ✅ Validación segura sin excepciones
export const safeValidateData = <T>(schema: z.ZodSchema<T>, data: unknown) => {
  return schema.safeParse(data);
}