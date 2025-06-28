// src/types/catequizando.ts - Tipos actualizados

export interface Catequizando {
  id: number; // Cambiado de id_catequizando a id para consistencia
  nombres: string;
  apellidos: string;
  fecha_nacimiento: string;
  documento_identidad: string;
  caso_especial: boolean;
  activo: boolean; // Nuevo campo para estado activo/inactivo
  
  // Campos relacionales opcionales
  id_parroquia?: number;
  nombre_parroquia?: string;
  nivel_actual?: string;
  id_nivel_actual?: number;
  
  // Campos calculados/agregados
  edad?: number;
  porcentaje_asistencia?: number;
  inscripcion_activa?: boolean;
  ultimo_nivel_completado?: string;
  foto_url?: string;
  
  // Campos de auditoría
  created_at?: string;
  updated_at?: string;
}

// Para crear un nuevo catequizando
export interface CatequizandoCreate {
  nombres: string;
  apellidos: string;
  fecha_nacimiento: string;
  documento_identidad: string;
  caso_especial?: boolean;
  id_parroquia?: number;
}

// Para actualizar un catequizando existente
export interface CatequizandoUpdate {
  nombres?: string;
  apellidos?: string;
  fecha_nacimiento?: string;
  documento_identidad?: string;
  caso_especial?: boolean;
  activo?: boolean;
  id_parroquia?: number;
}

// Datos del formulario (sin campos calculados)
export interface CatequizandoFormData {
  nombres: string;
  apellidos: string;
  fecha_nacimiento: string;
  documento_identidad: string;
  caso_especial?: boolean;
}

// Filtros para búsqueda y listado
export interface CatequizandoFilters {
  search?: string;
  parroquia?: number;
  nivel?: number;
  edad_min?: number;
  edad_max?: number;
  estado?: 'activo' | 'inactivo' | 'todos';
  tipo?: 'todos' | 'activos' | 'sin_inscripcion' | 'casos_especiales';
  caso_especial?: boolean;
  page?: number;
  limit?: number;
}

// Estadísticas expandidas del módulo
export interface CatequizandoStats {
  total_catequizandos: number;
  casos_especiales: number;
  sin_inscripcion: number;
  asistencia_promedio: number;
  
  // Distribución por edad (mejorada)
  por_edad: {
    rango: string; // "6-8 años", "9-12 años", etc.
    cantidad: number;
    porcentaje: number;
  }[];
  
  // Distribución por nivel
  por_nivel: {
    nivel: string;
    cantidad: number;
    porcentaje: number;
  }[];
  
  // Distribución por parroquia
  por_parroquia: {
    parroquia: string;
    cantidad: number;
    porcentaje: number;
  }[];
  
  // Estadísticas de tiempo (mantener compatibilidad)
  ninos: number; // 6-12 años
  adolescentes: number; // 13-17 años
  adultos: number; // 18+ años
  activos_este_ano: number;
  sin_inscripciones: number; // alias de sin_inscripcion
}

// Para el historial de inscripciones
export interface CatequizandoInscripcion {
  id: number;
  grupo: string;
  nivel: string;
  parroquia: string;
  periodo: string;
  fecha_inscripcion: string;
  estado: 'activa' | 'completada' | 'abandonada';
  pago_realizado: boolean;
  asistencia_promedio?: number;
}

// Para los certificados obtenidos
export interface CatequizandoCertificado {
  id: number;
  nivel: string;
  fecha_emision: string;
  estado: 'emitido' | 'pendiente' | 'anulado';
  parroquia: string;
  numero_certificado?: string;
}

// Para los sacramentos recibidos
export interface CatequizandoSacramento {
  id: number;
  nombre: string;
  fecha: string;
  parroquia: string;
  parroco?: string;
}

// Para representantes/tutores
export interface CatequizandoRepresentante {
  id: number;
  nombres: string;
  apellidos: string;
  relacion: string; // "padre", "madre", "tutor", etc.
  telefono?: string;
  email?: string;
  es_principal: boolean;
}

// Para padrinos
export interface CatequizandoPadrino {
  id: number;
  nombres: string;
  apellidos: string;
  tipo_padrino: string; // "bautismo", "confirmacion", etc.
  telefono?: string;
  email?: string;
}

// Para datos de bautismo
export interface CatequizandoBautismo {
  id: number;
  fecha_bautismo: string;
  parroquia_bautismo: string;
  parroco_bautismo?: string;
  libro?: string;
  folio?: string;
  numero?: string;
  padrinos?: string;
}

// Respuesta de validación de inscripción
export interface ValidacionInscripcion {
  elegible: boolean;
  razones: string[];
  requisitos_faltantes: string[];
  edad_apropiada: boolean;
  nivel_sugerido?: string;
}

// Para búsqueda avanzada
export interface CatequizandoBusqueda {
  id: number;
  nombres: string;
  apellidos: string;
  documento_identidad: string;
  parroquia: string;
  nivel_actual?: string;
  estado: 'activo' | 'inactivo';
  porcentaje_asistencia: number;
}
