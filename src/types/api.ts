// Tipos para respuestas de API
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

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

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