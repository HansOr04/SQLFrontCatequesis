// Tipos para autenticación y usuarios
export interface User {
  id_usuario: number;
  username: string;
  tipo_perfil: UserRole;
  id_parroquia?: number;
  nombre_parroquia?: string;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export type UserRole = 'admin' | 'parroco' | 'secretaria' | 'catequista' | 'consulta';

export interface LoginCredentials {
  username: string;
  password: string;
  id_parroquia?: number;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export interface PermissionConfig {
  roles: UserRole[];
  requireAll?: boolean;
}

export const USER_PERMISSIONS = {
  // Gestión de usuarios
  MANAGE_USERS: ['admin'] as UserRole[],
  VIEW_USERS: ['admin', 'parroco'] as UserRole[],
  
  // Gestión de parroquias
  MANAGE_PARROQUIAS: ['admin'] as UserRole[],
  VIEW_PARROQUIAS: ['admin', 'parroco'] as UserRole[],
  
  // Gestión de niveles
  MANAGE_NIVELES: ['admin'] as UserRole[],
  VIEW_NIVELES: ['admin', 'parroco', 'secretaria', 'catequista'] as UserRole[],
  
  // Gestión de catequizandos
  MANAGE_CATEQUIZANDOS: ['admin', 'parroco', 'secretaria'] as UserRole[],
  VIEW_CATEQUIZANDOS: ['admin', 'parroco', 'secretaria', 'catequista'] as UserRole[],
  
  // Gestión de grupos
  MANAGE_GRUPOS: ['admin', 'parroco', 'secretaria'] as UserRole[],
  VIEW_GRUPOS: ['admin', 'parroco', 'secretaria', 'catequista'] as UserRole[],
  
  // Gestión de inscripciones
  MANAGE_INSCRIPCIONES: ['admin', 'parroco', 'secretaria'] as UserRole[],
  VIEW_INSCRIPCIONES: ['admin', 'parroco', 'secretaria', 'catequista'] as UserRole[],
  
  // Gestión de asistencia
  MANAGE_ASISTENCIA: ['admin', 'parroco', 'secretaria', 'catequista'] as UserRole[],
  VIEW_ASISTENCIA: ['admin', 'parroco', 'secretaria', 'catequista'] as UserRole[],
  
  // Gestión de certificados
  MANAGE_CERTIFICADOS: ['admin', 'parroco', 'secretaria'] as UserRole[],
  VIEW_CERTIFICADOS: ['admin', 'parroco', 'secretaria', 'catequista'] as UserRole[],
  
  // Reportes
  VIEW_REPORTS: ['admin', 'parroco', 'secretaria'] as UserRole[],
  GENERATE_REPORTS: ['admin', 'parroco'] as UserRole[],
} as const;

export type PermissionKey = keyof typeof USER_PERMISSIONS;

// Etiquetas de roles para UI
export const USER_ROLE_LABELS = {
  admin: 'Administrador',
  parroco: 'Párroco', 
  secretaria: 'Secretaria',
  catequista: 'Catequista',
  consulta: 'Consulta',
} as const;