// Configuración de la aplicación
export const APP_CONFIG = {
  NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Sistema de Catequesis',
  VERSION: process.env.NEXT_PUBLIC_VERSION || '1.0.0',
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  ENVIRONMENT: process.env.NODE_ENV || 'development',
} as const;

// Roles de usuario
export const USER_ROLES = {
  ADMIN: 'admin',
  PARROCO: 'parroco',
  SECRETARIA: 'secretaria',
  CATEQUISTA: 'catequista',
  CONSULTA: 'consulta',
} as const;

// Etiquetas de roles para UI
export const USER_ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Administrador',
  [USER_ROLES.PARROCO]: 'Párroco',
  [USER_ROLES.SECRETARIA]: 'Secretaria',
  [USER_ROLES.CATEQUISTA]: 'Catequista',
  [USER_ROLES.CONSULTA]: 'Consulta',
} as const;

export const INSCRIPTION_STATUS = {
  ACTIVE: 'activo',
  INACTIVE: 'inactivo',
  PENDING: 'pendiente',
  COMPLETED: 'completado',
} as const;

export const INSCRIPTION_STATUS_LABELS: Record<string, string> = {
  'activo': 'Activo',
  'inactivo': 'Inactivo',
  'pendiente': 'Pendiente',
  'completado': 'Completado',
};

// Estados de pago
export const PAYMENT_STATUS = {
  PAID: true,
  PENDING: false,
} as const;

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  'true': 'Pagado',
  'false': 'Pendiente',
};

// Estados de certificados
export const CERTIFICATE_STATUS = {
  APPROVED: 'aprobado',
  PENDING: 'pendiente',
  ISSUED: 'emitido',
  REJECTED: 'rechazado',
} as const;

export const CERTIFICATE_STATUS_LABELS = {
  [CERTIFICATE_STATUS.APPROVED]: 'Aprobado',
  [CERTIFICATE_STATUS.PENDING]: 'Pendiente',
  [CERTIFICATE_STATUS.ISSUED]: 'Emitido',
  [CERTIFICATE_STATUS.REJECTED]: 'Rechazado',
} as const;

// Tipos de sacramento
export const SACRAMENT_TYPES = {
  BAPTISM: 'bautismo',
  CONFIRMATION: 'confirmacion',
  COMMUNION: 'comunion',
  MARRIAGE: 'matrimonio',
} as const;

export const SACRAMENT_TYPE_LABELS = {
  [SACRAMENT_TYPES.BAPTISM]: 'Bautismo',
  [SACRAMENT_TYPES.CONFIRMATION]: 'Confirmación',
  [SACRAMENT_TYPES.COMMUNION]: 'Primera Comunión',
  [SACRAMENT_TYPES.MARRIAGE]: 'Matrimonio',
} as const;

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  MAX_PAGE_SIZE: 100,
} as const;

// Configuración de fechas
export const DATE_FORMATS = {
  SHORT: 'dd/MM/yyyy',
  LONG: 'dd \'de\' MMMM \'de\' yyyy',
  WITH_TIME: 'dd/MM/yyyy HH:mm',
  TIME_ONLY: 'HH:mm',
  YEAR_MONTH: 'MMMM yyyy',
  ISO: 'yyyy-MM-dd',
} as const;

// Configuración de archivos
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: {
    IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    SPREADSHEETS: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  },
} as const;

// Configuración de validación
export const VALIDATION = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z0-9_.-]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 100,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
    PATTERN: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
  },
  PHONE: {
    PATTERN: /^(\+?593|0)[2-9]\d{7,8}$/,
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  CEDULA: {
    LENGTH: 10,
    PATTERN: /^\d{10}$/,
  },
} as const;

// Configuración de colores para gráficos
export const CHART_COLORS = {
  PRIMARY: '#4B6382',
  SECONDARY: '#A68868',
  SUCCESS: '#22c55e',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#3b82f6',
  NEUTRAL: '#64748b',
} as const;

// Configuración de notificaciones
export const NOTIFICATION = {
  DEFAULT_DURATION: 5000,
  POSITIONS: {
    TOP_RIGHT: 'top-right',
    TOP_LEFT: 'top-left',
    BOTTOM_RIGHT: 'bottom-right',
    BOTTOM_LEFT: 'bottom-left',
    TOP_CENTER: 'top-center',
    BOTTOM_CENTER: 'bottom-center',
  },
} as const;

// URLs de navegación
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  
  // Catequizandos
  CATEQUIZANDOS: '/catequizandos',
  CATEQUIZANDOS_NEW: '/catequizandos/nuevo',
  CATEQUIZANDOS_DETAIL: (id: number) => `/catequizandos/${id}`,
  CATEQUIZANDOS_EDIT: (id: number) => `/catequizandos/${id}/editar`,
  
  // Catequistas
  CATEQUISTAS: '/catequistas',
  CATEQUISTAS_NEW: '/catequistas/nuevo',
  CATEQUISTAS_DETAIL: (id: number) => `/catequistas/${id}`,
  CATEQUISTAS_EDIT: (id: number) => `/catequistas/${id}/editar`,
  
  // Grupos
  GRUPOS: '/grupos',
  GRUPOS_NEW: '/grupos/nuevo',
  GRUPOS_DETAIL: (id: number) => `/grupos/${id}`,
  GRUPOS_EDIT: (id: number) => `/grupos/${id}/editar`,
  
  // Asistencia
  ASISTENCIA: '/asistencia',
  ASISTENCIA_GRUPO: (id: number) => `/asistencia/grupo/${id}`,
  
  // Certificados
  CERTIFICADOS: '/certificados',
  CERTIFICADOS_NEW: '/certificados/nuevo',
  CERTIFICADOS_EMISION_MASIVA: '/certificados/emision-masiva',
  
  // Administración
  ADMINISTRACION: '/administracion',
  PARROQUIAS: '/administracion/parroquias',
  PARROQUIAS_NEW: '/administracion/parroquias/nueva',
  NIVELES: '/administracion/niveles',
  NIVELES_NEW: '/administracion/niveles/nuevo',
  USUARIOS: '/administracion/usuarios',
  USUARIOS_NEW: '/administracion/usuarios/nuevo',
  REPORTES: '/administracion/reportes',
} as const;

// Configuración de localStorage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'catequesis_auth_token',
  USER_DATA: 'catequesis_user_data',
  THEME: 'catequesis_theme',
  SIDEBAR_COLLAPSED: 'catequesis_sidebar_collapsed',
  TABLE_PREFERENCES: 'catequesis_table_preferences',
  FILTERS: 'catequesis_filters',
} as const;

// Configuración de breakpoints (responsive)
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px',
} as const;

// Configuración de z-index
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080,
} as const;

// Configuración de transiciones
export const TRANSITIONS = {
  FAST: 150,
  NORMAL: 200,
  SLOW: 300,
  SLOWER: 500,
} as const;

// Configuración de debounce
export const DEBOUNCE_DELAYS = {
  SEARCH: 300,
  INPUT: 500,
  RESIZE: 100,
  SCROLL: 50,
} as const;

// Mensajes del sistema
export const MESSAGES = {
  LOADING: 'Cargando...',
  NO_DATA: 'No hay datos disponibles',
  ERROR_GENERIC: 'Ha ocurrido un error inesperado',
  ERROR_NETWORK: 'Error de conexión. Verifique su conexión a internet.',
  ERROR_UNAUTHORIZED: 'No tiene permisos para realizar esta acción',
  ERROR_NOT_FOUND: 'El recurso solicitado no fue encontrado',
  SUCCESS_SAVE: 'Guardado exitosamente',
  SUCCESS_DELETE: 'Eliminado exitosamente',
  SUCCESS_UPDATE: 'Actualizado exitosamente',
  CONFIRM_DELETE: '¿Está seguro de que desea eliminar este elemento?',
  CONFIRM_DELETE_MULTIPLE: '¿Está seguro de que desea eliminar los elementos seleccionados?',
} as const;

// Configuración de exportación
export const EXPORT_FORMATS = {
  CSV: 'csv',
  XLSX: 'xlsx',
  PDF: 'pdf',
} as const;

// Íconos del sistema (usando Heroicons)
export const ICONS = {
  DASHBOARD: 'Squares2X2Icon',
  CATEQUIZANDOS: 'UsersIcon',
  CATEQUISTAS: 'AcademicCapIcon',
  GRUPOS: 'UserGroupIcon',
  ASISTENCIA: 'CheckCircleIcon',
  CERTIFICADOS: 'DocumentTextIcon',
  PARROQUIAS: 'BuildingLibraryIcon',
  NIVELES: 'Bars3BottomLeftIcon',
  USUARIOS: 'UserCircleIcon',
  REPORTES: 'ChartBarIcon',
  SEARCH: 'MagnifyingGlassIcon',
  FILTER: 'FunnelIcon',
  EXPORT: 'ArrowDownTrayIcon',
  IMPORT: 'ArrowUpTrayIcon',
  EDIT: 'PencilIcon',
  DELETE: 'TrashIcon',
  VIEW: 'EyeIcon',
  ADD: 'PlusIcon',
  SAVE: 'CheckIcon',
  CANCEL: 'XMarkIcon',
  SETTINGS: 'CogIcon',
  HELP: 'QuestionMarkCircleIcon',
  LOGOUT: 'ArrowRightOnRectangleIcon',
} as const;
// Permisos de usuario
export const USER_PERMISSIONS = {
  // Dashboard
  VIEW_DASHBOARD: 'VIEW_DASHBOARD',
  
  // Catequizandos
  VIEW_CATEQUIZANDOS: 'VIEW_CATEQUIZANDOS',
  CREATE_CATEQUIZANDOS: 'CREATE_CATEQUIZANDOS',
  EDIT_CATEQUIZANDOS: 'EDIT_CATEQUIZANDOS',
  DELETE_CATEQUIZANDOS: 'DELETE_CATEQUIZANDOS',
  
  // Catequistas
  VIEW_CATEQUISTAS: 'VIEW_CATEQUISTAS',
  CREATE_CATEQUISTAS: 'CREATE_CATEQUISTAS',
  EDIT_CATEQUISTAS: 'EDIT_CATEQUISTAS',
  DELETE_CATEQUISTAS: 'DELETE_CATEQUISTAS',
  
  // Grupos
  VIEW_GRUPOS: 'VIEW_GRUPOS',
  CREATE_GRUPOS: 'CREATE_GRUPOS',
  EDIT_GRUPOS: 'EDIT_GRUPOS',
  DELETE_GRUPOS: 'DELETE_GRUPOS',
  ASSIGN_CATEQUISTAS: 'ASSIGN_CATEQUISTAS',
  
  // Asistencia
  VIEW_ASISTENCIA: 'VIEW_ASISTENCIA',
  MANAGE_ASISTENCIA: 'MANAGE_ASISTENCIA',
  
  // Certificados
  VIEW_CERTIFICADOS: 'VIEW_CERTIFICADOS',
  CREATE_CERTIFICADOS: 'CREATE_CERTIFICADOS',
  APPROVE_CERTIFICADOS: 'APPROVE_CERTIFICADOS',
  ISSUE_CERTIFICADOS: 'ISSUE_CERTIFICADOS',
  MASS_ISSUE_CERTIFICADOS: 'MASS_ISSUE_CERTIFICADOS',
  
  // Administración
  MANAGE_PARROQUIAS: 'MANAGE_PARROQUIAS',
  MANAGE_NIVELES: 'MANAGE_NIVELES',
  MANAGE_USERS: 'MANAGE_USERS',
  MANAGE_SYSTEM: 'MANAGE_SYSTEM',
  
  // Reportes
  VIEW_REPORTS: 'VIEW_REPORTS',
  EXPORT_DATA: 'EXPORT_DATA',
  
  // Configuración
  MANAGE_SETTINGS: 'MANAGE_SETTINGS',
} as const;

// Mapeo de permisos por rol
export const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: [
    // Todos los permisos
    ...Object.values(USER_PERMISSIONS)
  ],
  
  [USER_ROLES.PARROCO]: [
    USER_PERMISSIONS.VIEW_DASHBOARD,
    USER_PERMISSIONS.VIEW_CATEQUIZANDOS,
    USER_PERMISSIONS.CREATE_CATEQUIZANDOS,
    USER_PERMISSIONS.EDIT_CATEQUIZANDOS,
    USER_PERMISSIONS.VIEW_CATEQUISTAS,
    USER_PERMISSIONS.CREATE_CATEQUISTAS,
    USER_PERMISSIONS.EDIT_CATEQUISTAS,
    USER_PERMISSIONS.VIEW_GRUPOS,
    USER_PERMISSIONS.CREATE_GRUPOS,
    USER_PERMISSIONS.EDIT_GRUPOS,
    USER_PERMISSIONS.ASSIGN_CATEQUISTAS,
    USER_PERMISSIONS.VIEW_ASISTENCIA,
    USER_PERMISSIONS.MANAGE_ASISTENCIA,
    USER_PERMISSIONS.VIEW_CERTIFICADOS,
    USER_PERMISSIONS.CREATE_CERTIFICADOS,
    USER_PERMISSIONS.APPROVE_CERTIFICADOS,
    USER_PERMISSIONS.ISSUE_CERTIFICADOS,
    USER_PERMISSIONS.MASS_ISSUE_CERTIFICADOS,
    USER_PERMISSIONS.VIEW_REPORTS,
    USER_PERMISSIONS.EXPORT_DATA,
  ],
  
  [USER_ROLES.SECRETARIA]: [
    USER_PERMISSIONS.VIEW_DASHBOARD,
    USER_PERMISSIONS.VIEW_CATEQUIZANDOS,
    USER_PERMISSIONS.CREATE_CATEQUIZANDOS,
    USER_PERMISSIONS.EDIT_CATEQUIZANDOS,
    USER_PERMISSIONS.VIEW_CATEQUISTAS,
    USER_PERMISSIONS.VIEW_GRUPOS,
    USER_PERMISSIONS.VIEW_ASISTENCIA,
    USER_PERMISSIONS.MANAGE_ASISTENCIA,
    USER_PERMISSIONS.VIEW_CERTIFICADOS,
    USER_PERMISSIONS.CREATE_CERTIFICADOS,
    USER_PERMISSIONS.ISSUE_CERTIFICADOS,
    USER_PERMISSIONS.EXPORT_DATA,
  ],
  
  [USER_ROLES.CATEQUISTA]: [
    USER_PERMISSIONS.VIEW_DASHBOARD,
    USER_PERMISSIONS.VIEW_CATEQUIZANDOS,
    USER_PERMISSIONS.VIEW_GRUPOS,
    USER_PERMISSIONS.VIEW_ASISTENCIA,
    USER_PERMISSIONS.MANAGE_ASISTENCIA,
    USER_PERMISSIONS.VIEW_CERTIFICADOS,
  ],
  
  [USER_ROLES.CONSULTA]: [
    USER_PERMISSIONS.VIEW_DASHBOARD,
    USER_PERMISSIONS.VIEW_CATEQUIZANDOS,
    USER_PERMISSIONS.VIEW_CATEQUISTAS,
    USER_PERMISSIONS.VIEW_GRUPOS,
    USER_PERMISSIONS.VIEW_ASISTENCIA,
    USER_PERMISSIONS.VIEW_CERTIFICADOS,
  ],
} as const;