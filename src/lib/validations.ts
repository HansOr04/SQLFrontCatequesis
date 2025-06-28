// src/lib/validations.ts
import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  parroquia: z.string().min(1, 'Selecciona una parroquia'),
})

export const catequizandoSchema = z.object({
  nombres: z.string().min(2, 'Los nombres deben tener al menos 2 caracteres'),
  apellidos: z.string().min(2, 'Los apellidos deben tener al menos 2 caracteres'),
  fecha_nacimiento: z.string().min(1, 'La fecha de nacimiento es requerida'),
  documento_identidad: z.string().min(6, 'El documento debe tener al menos 6 caracteres'),
  caso_especial: z.boolean().optional(),
})

export const grupoSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  id_nivel: z.number().min(1, 'Selecciona un nivel'),
  id_parroquia: z.number().min(1, 'Selecciona una parroquia'),
  periodo: z.string().min(4, 'El periodo es requerido'),
  capacidad: z.number().min(1, 'La capacidad debe ser mayor a 0').max(50, 'La capacidad máxima es 50'),
})

export const certificadoSchema = z.object({
  id_catequizando: z.number().min(1, 'Selecciona un catequizando'),
  id_nivel: z.number().min(1, 'Selecciona un nivel'),
  id_parroquia: z.number().min(1, 'Selecciona una parroquia'),
  fecha_emision: z.string().min(1, 'La fecha de emisión es requerida'),
  aprobado: z.boolean(),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type CatequizandoFormData = z.infer<typeof catequizandoSchema>
export type GrupoFormData = z.infer<typeof grupoSchema>
export type CertificadoFormData = z.infer<typeof certificadoSchema>