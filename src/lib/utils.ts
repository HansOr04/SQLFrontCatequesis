// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

export function formatDateTime(date: Date | string): string {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function calculateAge(birthDate: Date | string): number {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

export function getAttendancePercentage(present: number, total: number): number {
  if (total === 0) return 0
  return Math.round((present / total) * 100)
}

export function getAttendanceColor(percentage: number): string {
  if (percentage >= 80) return 'text-success-600'
  if (percentage >= 60) return 'text-warning-600'
  return 'text-error-600'
}

export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    'activo': 'bg-success-100 text-success-800',
    'inactivo': 'bg-neutral-100 text-neutral-800',
    'pendiente': 'bg-warning-100 text-warning-800',
    'completado': 'bg-success-100 text-success-800',
    'emitido': 'bg-primary-100 text-primary-800',
    'aprobado': 'bg-success-100 text-success-800',
    'presente': 'bg-success-100 text-success-800',
    'ausente': 'bg-error-100 text-error-800',
  }
  
  return statusColors[status.toLowerCase()] || 'bg-neutral-100 text-neutral-800'
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

