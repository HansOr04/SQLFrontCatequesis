// src/components/dashboard/QuickActions.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { 
  PlusIcon,
  UserPlusIcon,
  UsersIcon,
  DocumentPlusIcon,
  CheckCircleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/utils';

// Tipo para permisos permitidos
type Permission = 'CREATE_CATEQUIZANDO' | 'CREATE_GRUPO' | 'MANAGE_ASISTENCIA' | 'CREATE_CERTIFICADO' | 'VIEW_REPORTS';

interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<any>;
  color: string;
  permissions: Permission[];
}

export const QuickActions: React.FC = () => {
  const { user } = useAuth();

  const hasPermission = (permissions: Permission[]): boolean => {
    if (!user) return false;
    
    // Admin tiene todos los permisos
    if (user.tipo_perfil === 'admin') return true;
    
    // Lógica simplificada de permisos basada en roles
    const userPermissions: Record<string, Permission[]> = {
      parroco: ['CREATE_CATEQUIZANDO', 'CREATE_GRUPO', 'MANAGE_ASISTENCIA', 'CREATE_CERTIFICADO', 'VIEW_REPORTS'],
      secretaria: ['CREATE_CATEQUIZANDO', 'MANAGE_ASISTENCIA', 'CREATE_CERTIFICADO'],
      catequista: ['MANAGE_ASISTENCIA'],
      consulta: [],
    };
    
    const allowedPermissions = userPermissions[user.tipo_perfil] || [];
    return permissions.some(permission => allowedPermissions.includes(permission));
  };

  const quickActions: QuickAction[] = [
    {
      title: 'Nuevo Catequizando',
      description: 'Registrar un nuevo catequizando',
      href: ROUTES.CATEQUIZANDOS_NEW,
      icon: UserPlusIcon,
      color: 'bg-blue-500 hover:bg-blue-600',
      permissions: ['CREATE_CATEQUIZANDO'],
    },
    {
      title: 'Crear Grupo',
      description: 'Formar un nuevo grupo de catequesis',
      href: ROUTES.GRUPOS_NEW,
      icon: UsersIcon,
      color: 'bg-green-500 hover:bg-green-600',
      permissions: ['CREATE_GRUPO'],
    },
    {
      title: 'Registrar Asistencia',
      description: 'Marcar asistencia de catequizandos',
      href: ROUTES.ASISTENCIA,
      icon: CheckCircleIcon,
      color: 'bg-yellow-500 hover:bg-yellow-600',
      permissions: ['MANAGE_ASISTENCIA'],
    },
    {
      title: 'Emitir Certificado',
      description: 'Crear nuevo certificado',
      href: ROUTES.CERTIFICADOS_NEW,
      icon: DocumentPlusIcon,
      color: 'bg-purple-500 hover:bg-purple-600',
      permissions: ['CREATE_CERTIFICADO'],
    },
    {
      title: 'Ver Reportes',
      description: 'Consultar estadísticas y reportes',
      href: ROUTES.REPORTES,
      icon: ChartBarIcon,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      permissions: ['VIEW_REPORTS'],
    },
  ];

  const visibleActions = quickActions.filter(action => hasPermission(action.permissions));

  if (visibleActions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-500 text-center py-8">
            No hay acciones disponibles para tu perfil
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acciones Rápidas</CardTitle>
        <p className="text-sm text-neutral-600">
          Accede rápidamente a las funciones más utilizadas
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {visibleActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="group relative overflow-hidden rounded-lg border border-neutral-200 p-4 hover:border-neutral-300 transition-all duration-200"
            >
              <div className="flex items-start space-x-3">
                <div className={cn(
                  'flex-shrink-0 rounded-lg p-2 text-white transition-colors',
                  action.color
                )}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-neutral-900 group-hover:text-primary-600 transition-colors">
                    {action.title}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    {action.description}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <PlusIcon className="h-4 w-4 text-neutral-400 group-hover:text-primary-500 transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};