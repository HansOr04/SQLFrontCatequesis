import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina clases CSS de forma inteligente usando clsx y tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formatea un número como moneda
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Formatea una fecha de forma legible
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  return new Intl.DateTimeFormat('es-EC', { ...defaultOptions, ...options }).format(dateObj);
}

/**
 * Formatea una fecha de forma corta
 */
export function formatDateShort(date: Date | string): string {
  return formatDate(date, {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * Formatea una fecha con hora
 */
export function formatDateTime(date: Date | string): string {
  return formatDate(date, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Capitaliza la primera letra de una cadena
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convierte un string a formato título
 */
export function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

/**
 * Trunca un texto a un número específico de caracteres
 */
export function truncate(str: string, length: number, suffix = '...'): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + suffix;
}

/**
 * Genera un ID único
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Verifica si una cadena es un email válido
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Verifica si una cadena es un número de teléfono válido (Ecuador)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+?593|0)[2-9]\d{7,8}$/;
  return phoneRegex.test(phone.replace(/\s|-/g, ''));
}

/**
 * Verifica si una cadena es una cédula ecuatoriana válida
 */
export function isValidCedula(cedula: string): boolean {
  if (cedula.length !== 10) return false;
  
  const digits = cedula.split('').map(Number);
  const province = parseInt(cedula.substring(0, 2));
  
  if (province < 1 || province > 24) return false;
  
  const lastDigit = digits[9];
  let sum = 0;
  
  for (let i = 0; i < 9; i++) {
    let product = digits[i] * (i % 2 === 0 ? 2 : 1);
    if (product > 9) product -= 9;
    sum += product;
  }
  
  const checkDigit = sum % 10 === 0 ? 0 : 10 - (sum % 10);
  return checkDigit === lastDigit;
}

/**
 * Formatea un número de teléfono ecuatoriano
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('593')) {
    // Formato internacional
    const national = cleaned.substring(3);
    return `+593 ${national.substring(0, 1)} ${national.substring(1, 4)} ${national.substring(4)}`;
  } else if (cleaned.length === 10) {
    // Formato nacional
    return `${cleaned.substring(0, 2)} ${cleaned.substring(2, 5)} ${cleaned.substring(5)}`;
  } else if (cleaned.length === 9) {
    // Sin código de área
    return `${cleaned.substring(0, 1)} ${cleaned.substring(1, 4)} ${cleaned.substring(4)}`;
  }
  
  return phone;
}

/**
 * Formatea una cédula ecuatoriana
 */
export function formatCedula(cedula: string): string {
  const cleaned = cedula.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `${cleaned.substring(0, 2)}.${cleaned.substring(2, 5)}.${cleaned.substring(5, 8)}.${cleaned.substring(8)}`;
  }
  return cedula;
}

/**
 * Calcula la edad basada en la fecha de nacimiento
 */
export function calculateAge(birthDate: Date | string): number {
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  const today = new Date();
  
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Obtiene las iniciales de un nombre
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
}

/**
 * Convierte bytes a formato legible
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Genera un color basado en una cadena
 */
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Copia texto al portapapeles
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback para navegadores que no soportan clipboard API
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
}

/**
 * Descarga un archivo blob
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Convierte un objeto a query string
 */
export function objectToQueryString(obj: Record<string, any>): string {
  const params = new URLSearchParams();
  
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined && value !== '') {
      params.append(key, String(value));
    }
  }
  
  return params.toString();
}

/**
 * Parsea query string a objeto
 */
export function queryStringToObject(queryString: string): Record<string, string> {
  const params = new URLSearchParams(queryString);
  const obj: Record<string, string> = {};
  
  // Usar Array.from para compatibilidad
  Array.from(params.entries()).forEach(([key, value]) => {
    obj[key] = value;
  });
  
  return obj;
}