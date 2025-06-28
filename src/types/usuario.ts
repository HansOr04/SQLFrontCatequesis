import { UserRole } from './auth';

export interface Usuario {
  id_usuario: number;
  username: string;
  tipo_perfil: UserRole;
  id_parroquia?: number;
  nombre_parroquia?: string;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UsuarioFormData {
  username: string;
  password: string;
  tipo_perfil: UserRole;
  id_parroquia?: number;
}

export interface UsuarioUpdateData {
  username: string;
  tipo_perfil: UserRole;
  id_parroquia?: number;
}

export interface UsuarioFilters {
  search?: string;
  tipo_perfil?: UserRole;
  parroquia?: number;
  activo?: boolean;
}

export interface UsuarioStats {
  total_usuarios: number;
  admins: number;
  parrocos: number;
  secretarias: number;
  catequistas: number;
  consultas: number;
  parroquias_con_usuarios: number;
}
