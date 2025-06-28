export interface Catequizando {
  id_catequizando: number;
  nombres: string;
  apellidos: string;
  fecha_nacimiento: string;
  documento_identidad: string;
  caso_especial: boolean;
  edad?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CatequizandoFormData {
  nombres: string;
  apellidos: string;
  fecha_nacimiento: string;
  documento_identidad: string;
  caso_especial?: boolean;
}

export interface CatequizandoFilters {
  search?: string;
  parroquia?: number;
  nivel?: number;
  edad_min?: number;
  edad_max?: number;
  caso_especial?: boolean;
}

export interface CatequizandoStats {
  total_catequizandos: number;
  casos_especiales: number;
  ninos: number;
  adolescentes: number;
  adultos: number;
  activos_este_ano: number;
  sin_inscripciones: number;
}
