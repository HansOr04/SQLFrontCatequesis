// Respuesta base de la API
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// Respuesta de error de la API
export interface ApiError {
  success: false;
  message: string;
  error?: any;
  timestamp: string;
}

// Paginación
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// Filtros comunes
export interface BaseFilters {
  search?: string;
  page?: number;
  limit?: number;
}

export interface DateRangeFilter {
  fecha_inicio?: string;
  fecha_fin?: string;
}

// Estados comunes
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastFetch?: number;
}

// Opciones para select/dropdown
export interface SelectOption<T = string | number> {
  value: T;
  label: string;
  disabled?: boolean;
  description?: string;
}

// Configuración de tabla
export interface TableColumn<T = any> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, record: T) => React.ReactNode;
  hidden?: boolean;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

// Configuración de formularios
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox' | 'radio';
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  options?: SelectOption[];
  validation?: ValidationRule[];
}

export interface ValidationRule {
  type: 'required' | 'email' | 'min' | 'max' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: any;
  message: string;
  validator?: (value: any) => boolean;
}

// Estadísticas
export interface StatCard {
  label: string;
  value: number | string;
  icon?: React.ComponentType<any>;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  trend?: {
    value: number;
    direction: 'up' | 'down';
    period: string;
  };
}

// Notificaciones
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary';
}

// Configuración de modal
export interface ModalConfig {
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
}

// Configuración de confirmación
export interface ConfirmConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

// Configuración de export/import
export interface ExportConfig {
  format: 'csv' | 'xlsx' | 'pdf';
  filename?: string;
  columns?: string[];
  filters?: Record<string, any>;
}

export interface ImportConfig {
  acceptedFormats: string[];
  maxFileSize: number;
  requiredColumns: string[];
  mapping?: Record<string, string>;
}

// Breadcrumb
export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

// Configuración de navegación
export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ComponentType<any>;
  badge?: string | number;
  children?: NavItem[];
  roles?: string[];
  isExternal?: boolean;
}

// Theme configuration
export interface ThemeConfig {
  mode: 'light' | 'dark';
  primaryColor: string;
  secondaryColor: string;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  fontFamily: string;
}

// File upload
export interface FileUpload {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  url?: string;
}

// Search configuration
export interface SearchConfig {
  placeholder: string;
  fields: string[];
  debounceMs: number;
  minLength: number;
  caseSensitive: boolean;
}

// Feature flags
export interface FeatureFlags {
  [key: string]: boolean;
}

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/auth/login',
  AUTH_PROFILE: '/auth/profile',
  AUTH_LOGOUT: '/auth/logout',
  
  // Parroquias
  PARROQUIAS: '/parroquias',
  PARROQUIAS_SEARCH: '/parroquias/search',
  PARROQUIAS_STATS: (id: number) => `/parroquias/${id}/stats`,
  
  // Niveles
  NIVELES: '/niveles',
  NIVELES_ORDENADOS: '/niveles/ordenados',
  NIVELES_REORDER: '/niveles/reorder',
  NIVELES_STATS: (id: number) => `/niveles/${id}/stats`,
  
  // Catequizandos
  CATEQUIZANDOS: '/catequizandos',
  CATEQUIZANDOS_SEARCH: '/catequizandos/search',
  CATEQUIZANDOS_STATS: '/catequizandos/stats',
  CATEQUIZANDOS_BY_DOCUMENTO: (documento: string) => `/catequizandos/documento/${documento}`,
  CATEQUIZANDOS_INSCRIPCIONES: (id: number) => `/catequizandos/${id}/inscripciones`,
  CATEQUIZANDOS_CERTIFICADOS: (id: number) => `/catequizandos/${id}/certificados`,
  CATEQUIZANDOS_SACRAMENTOS: (id: number) => `/catequizandos/${id}/sacramentos`,
  CATEQUIZANDOS_REPRESENTANTES: (id: number) => `/catequizandos/${id}/representantes`,
  CATEQUIZANDOS_PADRINOS: (id: number) => `/catequizandos/${id}/padrinos`,
  CATEQUIZANDOS_BAUTISMO: (id: number) => `/catequizandos/${id}/bautismo`,
  CATEQUIZANDOS_VALIDAR_INSCRIPCION: (id: number) => `/catequizandos/${id}/validar-inscripcion`,
  
  // Grupos
  GRUPOS: '/grupos',
  GRUPOS_SEARCH: '/grupos/search',
  GRUPOS_BY_PARROQUIA: (id: number) => `/grupos/parroquia/${id}`,
  GRUPOS_BY_NIVEL: (id: number) => `/grupos/nivel/${id}`,
  GRUPOS_INSCRIPCIONES: (id: number) => `/grupos/${id}/inscripciones`,
  GRUPOS_CATEQUISTAS: (id: number) => `/grupos/${id}/catequistas`,
  GRUPOS_STATS: (id: number) => `/grupos/${id}/stats`,
  
  // Inscripciones
  INSCRIPCIONES: '/inscripciones',
  INSCRIPCIONES_SEARCH: '/inscripciones/search',
  INSCRIPCIONES_STATS: '/inscripciones/stats',
  INSCRIPCIONES_PENDIENTES_PAGO: '/inscripciones/pendientes-pago',
  INSCRIPCIONES_BY_CATEQUIZANDO: (id: number) => `/inscripciones/catequizando/${id}`,
  INSCRIPCIONES_BY_GRUPO: (id: number) => `/inscripciones/grupo/${id}`,
  INSCRIPCIONES_INSCRIBIR: '/inscripciones/inscribir',
  INSCRIPCIONES_PAGO: (id: number) => `/inscripciones/${id}/pago`,
  
  // Asistencias
  ASISTENCIAS: '/asistencias',
  ASISTENCIAS_MASIVA: (idGrupo: number) => `/asistencias/grupo/${idGrupo}/masiva`,
  ASISTENCIAS_BY_INSCRIPCION: (id: number) => `/asistencias/inscripcion/${id}`,
  ASISTENCIAS_BY_GRUPO_FECHA: (idGrupo: number, fecha: string) => `/asistencias/grupo/${idGrupo}/fecha/${fecha}`,
  ASISTENCIAS_RESUMEN: (idGrupo: number) => `/asistencias/grupo/${idGrupo}/resumen`,
  ASISTENCIAS_REPORTE: (idGrupo: number) => `/asistencias/grupo/${idGrupo}/reporte`,
  ASISTENCIAS_STATS: (idGrupo: number) => `/asistencias/grupo/${idGrupo}/stats`,
  ASISTENCIAS_FECHAS: (idGrupo: number) => `/asistencias/grupo/${idGrupo}/fechas`,
  ASISTENCIAS_BAJA_ASISTENCIA: '/asistencias/baja-asistencia',
  
  // Certificados
  CERTIFICADOS: '/certificados',
  CERTIFICADOS_EMISION_MASIVA: '/certificados/emision-masiva',
  
  // Usuarios
  USUARIOS: '/usuarios',
  USUARIOS_SEARCH: '/usuarios/search',
  USUARIOS_STATS: '/usuarios/stats',
  USUARIOS_BY_PARROQUIA: (id: number) => `/usuarios/parroquia/${id}`,
  USUARIOS_PASSWORD: (id: number) => `/usuarios/${id}/password`,
  USUARIOS_RESET_PASSWORD: (id: number) => `/usuarios/${id}/reset-password`,
  USUARIOS_TOGGLE_STATUS: (id: number) => `/usuarios/${id}/toggle-status`,
} as const;