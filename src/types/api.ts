// src/types/api.ts - TIPOS CORREGIDOS Y UNIFICADOS
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    hasNext?: boolean;
    hasPrevious?: boolean;
  };
  timestamp?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
  status?: number;
}

// Estados de loading
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ESTRUCTURA UNIFICADA DE PAGINACIÓN
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  // Aliases para compatibilidad con backend
  current_page?: number;
  per_page?: number;
  total_pages?: number;
}

// RESPUESTA PAGINADA PRINCIPAL (con meta)
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// RESPUESTA PAGINADA ALTERNATIVA (con pagination)
export interface PaginatedResponseAlt<T> {
  data: T[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

// TIPO UNIFICADO que acepta ambas estructuras
export type UnifiedPaginatedResponse<T> = PaginatedResponse<T> | PaginatedResponseAlt<T>;

export interface FilterParams {
  [key: string]: string | number | boolean | undefined;
}

// Tipos para requests HTTP
export interface RequestConfig {
  timeout?: number;
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

// Tipos para upload de archivos
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadOptions {
  onProgress?: (progress: UploadProgress) => void;
  timeout?: number;
}

// Interfaz para columnas de tabla
export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  hidden?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

// Configuración de sorting
export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}