// src/lib/utils.ts - Corregido

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Función de utilidad para clases CSS
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Función para calcular la edad a partir de fecha de nacimiento
export const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

// Función para formatear fecha - Acepta tanto Date como string para compatibilidad
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Función para formatear fecha con opciones personalizadas
export const formatDateWithOptions = (
  date: Date | string, 
  options: Intl.DateTimeFormatOptions
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('es-ES', options);
};

// Función para formatear fecha desde string (alias para compatibilidad)
export const formatDateString = (dateString: string): string => {
  return formatDate(dateString);
};

// Función para formatear fecha corta - Acepta Date o string
export const formatDateShort = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// Función para validar documento de identidad ecuatoriano
export const validateCedulaEcuador = (cedula: string): boolean => {
  if (cedula.length !== 10) return false;
  
  const digits = cedula.split('').map(Number);
  const province = parseInt(cedula.substring(0, 2));
  
  if (province < 1 || province > 24) return false;
  
  const coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let sum = 0;
  
  for (let i = 0; i < 9; i++) {
    let result = digits[i] * coefficients[i];
    if (result >= 10) result -= 9;
    sum += result;
  }
  
  const verifier = (10 - (sum % 10)) % 10;
  return verifier === digits[9];
};

// Función para obtener rango de edad
export const getAgeRange = (age: number): string => {
  if (age < 6) return '0-5 años';
  if (age <= 8) return '6-8 años';
  if (age <= 12) return '9-12 años';
  if (age <= 15) return '13-15 años';
  if (age <= 18) return '16-18 años';
  return '19+ años';
};

// Función para determinar el color de asistencia
export const getAttendanceColor = (percentage: number): 'success' | 'warning' | 'error' => {
  if (percentage >= 80) return 'success';
  if (percentage >= 60) return 'warning';
  return 'error';
};

// Función para generar iniciales
export const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

// Función para validar edad mínima/máxima para niveles
export const validateAgeForLevel = (age: number, level: string): boolean => {
  const ageRanges: Record<string, { min: number; max: number }> = {
    'Iniciación': { min: 6, max: 8 },
    'Reconciliación': { min: 8, max: 10 },
    'Comunión': { min: 9, max: 11 },
    'Confirmación I': { min: 12, max: 14 },
    'Confirmación II': { min: 13, max: 15 },
    'Jóvenes': { min: 16, max: 25 }
  };
  
  const range = ageRanges[level];
  if (!range) return true; // Si no hay rango definido, se permite
  
  return age >= range.min && age <= range.max;
};

// Función para formatear porcentaje
export const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`;
};

// Función para determinar si un catequizando es elegible para inscripción
export const isEligibleForEnrollment = (
  catequizando: any,
  targetLevel: string
): { eligible: boolean; reasons: string[] } => {
  const reasons: string[] = [];
  
  // Verificar si está activo
  if (catequizando.activo === false) {
    reasons.push('El catequizando no está activo');
  }
  
  const age = calculateAge(catequizando.fecha_nacimiento);
  if (!validateAgeForLevel(age, targetLevel)) {
    reasons.push(`La edad (${age} años) no es apropiada para el nivel ${targetLevel}`);
  }
  
  // Verificar si ya tiene inscripción activa
  if (catequizando.inscripcion_activa) {
    reasons.push('Ya tiene una inscripción activa');
  }
  
  return {
    eligible: reasons.length === 0,
    reasons
  };
};

// Función para formatear nombres completos
export const formatFullName = (nombres: string, apellidos: string): string => {
  return `${nombres.trim()} ${apellidos.trim()}`;
};

// Función para capitalizar primera letra
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Función para limpiar y formatear documento
export const formatDocumento = (documento: string): string => {
  return documento.replace(/[^a-zA-Z0-9\-]/g, '').toUpperCase();
};

// Función para validar email básico
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Función para generar slug/ID de URL
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// Función para truncar texto
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

// Función para formatear teléfono ecuatoriano
export const formatPhoneEcuador = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  if (cleaned.length === 9) {
    return `0${cleaned.slice(0, 1)}-${cleaned.slice(1, 4)}-${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phone; // Retornar original si no coincide con formatos esperados
};

// Función para determinar la clase de nivel según el tipo
export const getNivelClass = (nivel: string): string => {
  const nivelLower = nivel.toLowerCase();
  
  if (nivelLower.includes('iniciación')) return 'bg-blue-100 text-blue-800';
  if (nivelLower.includes('reconciliación')) return 'bg-green-100 text-green-800';
  if (nivelLower.includes('comunión')) return 'bg-yellow-100 text-yellow-800';
  if (nivelLower.includes('confirmación')) return 'bg-purple-100 text-purple-800';
  if (nivelLower.includes('jóvenes')) return 'bg-indigo-100 text-indigo-800';
  
  return 'bg-gray-100 text-gray-800';
};