
// src/types/usuario.ts
export interface Usuario {
  id_usuario: number
  username: string
  tipo_perfil: 'admin' | 'parroco' | 'secretaria' | 'catequista' | 'consulta'
  id_parroquia?: number
  nombre_parroquia?: string
  activo: boolean
  fecha_creacion?: string
  ultimo_acceso?: string
}

