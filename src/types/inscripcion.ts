// src/types/inscripcion.ts - Actualizado
export interface Inscripcion {
  id_inscripcion: number;
  id_catequizando: number;
  id_grupo: number;
  id_parroquia: number;
  fecha_inscripcion: string;
  pago_realizado: boolean;
  observaciones?: string;
  
  // Campos relacionales
  nombre_catequizando?: string;
  apellidos_catequizando?: string;
  nombres_catequizando?: string; // Alias para compatibilidad
  apellido_catequizando?: string; // Alias para compatibilidad
  documento_identidad?: string;
  nombre_grupo?: string;
  nombre_parroquia?: string;
  periodo?: string;
  nivel?: string;
  nombre_nivel?: string;
}

export interface InscripcionFormData {
  id_catequizando: number;
  id_grupo: number;
  id_parroquia?: number;
  fecha_inscripcion?: string;
  pago_realizado?: boolean;
  observaciones?: string;
}

export interface InscripcionFilters {
  search?: string;
  grupo?: number;
  parroquia?: number;
  catequizando?: number;
  periodo?: string;
  pago?: boolean;
  page?: number;
  limit?: number;
}