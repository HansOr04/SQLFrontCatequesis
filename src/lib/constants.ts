// src/lib/constants.ts
export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'Sistema de Catequesis',
  version: process.env.NEXT_PUBLIC_VERSION || '1.0.0',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  itemsPerPage: 10,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  supportedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
} as const

export const USER_ROLES = {
  ADMIN: 'admin',
  PARROCO: 'parroco',
  SECRETARIA: 'secretaria',
  CATEQUISTA: 'catequista',
  CONSULTA: 'consulta',
} as const

export const CERTIFICATE_STATUSES = {
  PENDIENTE: 'pendiente',
  APROBADO: 'aprobado',
  EMITIDO: 'emitido',
} as const

export const ATTENDANCE_STATUSES = {
  PRESENTE: 'presente',
  AUSENTE: 'ausente',
} as const

export const NAVIGATION_ITEMS = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: 'LayoutDashboard',
    section: 'main'
  },
  {
    name: 'Catequizandos',
    href: '/catequizandos',
    icon: 'Users',
    section: 'main'
  },
  {
    name: 'Catequistas',
    href: '/catequistas',
    icon: 'UserCheck',
    section: 'main'
  },
  {
    name: 'Grupos',
    href: '/grupos',
    icon: 'UsersIcon',
    section: 'main'
  },
  {
    name: 'Asistencia',
    href: '/asistencia',
    icon: 'CheckCircle',
    section: 'main'
  },
  {
    name: 'Certificados',
    href: '/certificados',
    icon: 'Award',
    section: 'main'
  },
  {
    name: 'Parroquias',
    href: '/administracion/parroquias',
    icon: 'Building',
    section: 'admin'
  },
  {
    name: 'Niveles',
    href: '/administracion/niveles',
    icon: 'Layers',
    section: 'admin'
  },
  {
    name: 'Usuarios',
    href: '/administracion/usuarios',
    icon: 'UserCog',
    section: 'admin'
  },
  {
    name: 'Reportes',
    href: '/administracion/reportes',
    icon: 'FileText',
    section: 'admin'
  },
] as const

