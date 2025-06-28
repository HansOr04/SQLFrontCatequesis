// src/types/auth.ts
export interface User {
  id_usuario: number
  username: string
  tipo_perfil: 'admin' | 'parroco' | 'secretaria' | 'catequista' | 'consulta'
  id_parroquia?: number
  nombre_parroquia?: string
  activo: boolean
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
}

// src/types/api.ts
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: any
  timestamp: string
}

export interface PaginatedResponse<T = any> {
  data: T[]
  pagination: {
    current_page: number
    per_page: number
    total: number
    total_pages: number
  }
}

export interface ApiError {
  success: false
  message: string
  error?: any
  timestamp: string
}