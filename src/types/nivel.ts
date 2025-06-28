export interface Nivel {
  id_nivel: number;
  nombre: string;
  descripcion: string;
  orden: number;
  nivel_anterior?: string;
  nivel_siguiente?: string;
  created_at?: string;
  updated_at?: string;
}

export interface NivelFormData {
  nombre: string;
  descripcion: string;
  orden: number;
}

export interface NivelStats {
  total_grupos: number;
  total_catequizandos: number;
  total_aprobados: number;
  sacramentos_asociados: number;
}
