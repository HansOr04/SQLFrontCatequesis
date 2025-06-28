// src/components/auth/ProtectedRoute.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ROUTES } from '@/lib/constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  redirectTo = ROUTES.LOGIN,
}) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-error-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-error-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            Acceso Denegado
          </h2>
          <p className="text-neutral-600 mb-6">
            No tienes permisos suficientes para acceder a esta página.
          </p>
          <button
            onClick={() => router.back()}
            className="btn-primary"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  // Renderizar contenido si todo está correcto
  return <>{children}</>;
};

// Hook personalizado para verificar permisos
export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    // Admin tiene todos los permisos
    if (user.tipo_perfil === 'admin') return true;
    
    // Mapeo de permisos por rol
    const rolePermissions: Record<string, string[]> = {
      parroco: [
        'VIEW_DASHBOARD',
        'VIEW_CATEQUIZANDOS',
        'MANAGE_CATEQUIZANDOS',
        'VIEW_CATEQUISTAS',
        'MANAGE_CATEQUISTAS',
        'VIEW_GRUPOS',
        'MANAGE_GRUPOS',
        'VIEW_ASISTENCIA',
        'MANAGE_ASISTENCIA',
        'VIEW_CERTIFICADOS',
        'MANAGE_CERTIFICADOS',
        'VIEW_REPORTS',
      ],
      secretaria: [
        'VIEW_DASHBOARD',
        'VIEW_CATEQUIZANDOS',
        'MANAGE_CATEQUIZANDOS',
        'VIEW_CATEQUISTAS',
        'VIEW_GRUPOS',
        'VIEW_ASISTENCIA',
        'MANAGE_ASISTENCIA',
        'VIEW_CERTIFICADOS',
        'MANAGE_CERTIFICADOS',
      ],
      catequista: [
        'VIEW_DASHBOARD',
        'VIEW_CATEQUIZANDOS',
        'VIEW_GRUPOS',
        'VIEW_ASISTENCIA',
        'MANAGE_ASISTENCIA',
        'VIEW_CERTIFICADOS',
      ],
      consulta: [
        'VIEW_DASHBOARD',
        'VIEW_CATEQUIZANDOS',
        'VIEW_CATEQUISTAS',
        'VIEW_GRUPOS',
        'VIEW_ASISTENCIA',
        'VIEW_CERTIFICADOS',
      ],
    };

    const userPermissions = rolePermissions[user.tipo_perfil] || [];
    return userPermissions.includes(permission);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  const canAccess = (requiredRoles: string[]): boolean => {
    if (!user || requiredRoles.length === 0) return true;
    return requiredRoles.includes(user.tipo_perfil);
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccess,
    userRole: user?.tipo_perfil,
    isAdmin: user?.tipo_perfil === 'admin',
  };
};

export default ProtectedRoute;