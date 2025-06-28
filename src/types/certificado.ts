// src/types/certificado.ts
export interface Certificado {
  id_certificado: number
  id_catequizando: number
  id_nivel: number
  id_parroquia: number
  fecha_emision: string
  aprobado: boolean
  emitido: boolean
  nombre_catequizando?: string
  documento_identidad?: string
  nombre_nivel?: string
  nombre_parroquia?: string
  estado: 'pendiente' | 'aprobado' | 'emitido'
}

