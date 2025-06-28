// src/types/parroquia.ts
export interface Parroquia {
  id_parroquia: number
  nombre: string
  direccion: string
  telefono: string
  parroco?: string
  total_catequistas?: number
  total_catequizandos?: number
  total_grupos?: number
}

