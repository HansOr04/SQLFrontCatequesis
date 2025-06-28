// src/types/nivel.ts
export interface Nivel {
  id_nivel: number
  nombre: string
  descripcion: string
  orden: number
  duracion?: string
  sacramento?: string
  total_grupos?: number
  total_catequizandos?: number
}
