// src/components/dashboard/RecentActivity.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { 
  UserPlusIcon,
  DocumentCheckIcon,
  CheckCircleIcon,
  UserGroupIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { formatDate } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';

interface ActivityItem {
  id: number;
  tipo: 'inscripcion' | 'certificado' | 'asistencia' | 'grupo';
  descripcion: string;
  fecha: string;
  usuario?: string;
  entidad_id?: number;
  entidad_nombre?: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
  loading: boolean;
  error: string | null;
}

const getActivityIcon = (tipo: string) => {
  switch (tipo) {
    case 'inscripcion':
      return UserPlusIcon;
    case 'certificado':
      return DocumentCheckIcon;
    case 'asistencia':
      return CheckCircleIcon;
    case 'grupo':
      return UserGroupIcon;
    default:
      return ClockIcon;
  }
};

const getActivityColor = (tipo: string) => {
  switch (tipo) {
    case 'inscripcion':
      return 'primary';
    case 'certificado':
      return 'success';
    case 'asistencia':
      return 'warning';
    case 'grupo':
      return 'secondary';
    default:
      return 'neutral';
  }
};

const getActivityLink = (item: ActivityItem): string => {
  switch (item.tipo) {
    case 'inscripcion':
      return item.entidad_id ? ROUTES.CATEQUIZANDOS_DETAIL(item.entidad_id) : ROUTES.CATEQUIZANDOS;
    case 'certificado':
      return ROUTES.CERTIFICADOS;
    case 'asistencia':
      return ROUTES.ASISTENCIA;
    case 'grupo':
      return item.entidad_id ? ROUTES.GRUPOS_DETAIL(item.entidad_id) : ROUTES.GRUPOS;
    default:
      return ROUTES.DASHBOARD;
  }
};

export const RecentActivity: React.FC<RecentActivityProps> = ({
  activities,
  loading,
  error,
}) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <LoadingSpinner size="md" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-red-600">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-neutral-400" />
            </div>
            <p className="text-neutral-500">No hay actividad reciente</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad Reciente</CardTitle>
        <p className="text-sm text-neutral-600">
          Últimas acciones realizadas en el sistema
        </p>
      </CardHeader>
      <CardContent>
        <div className="flow-root">
          <ul className="-mb-8">
            {activities.map((activity, activityIdx) => {
              const Icon = getActivityIcon(activity.tipo);
              const color = getActivityColor(activity.tipo);
              const link = getActivityLink(activity);

              return (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {activityIdx !== activities.length - 1 ? (
                      <span
                        className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-neutral-200"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className={`
                          h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white
                          ${color === 'primary' ? 'bg-primary-500' : ''}
                          ${color === 'success' ? 'bg-success-500' : ''}
                          ${color === 'warning' ? 'bg-warning-500' : ''}
                          ${color === 'secondary' ? 'bg-secondary-500' : ''}
                          ${color === 'neutral' ? 'bg-neutral-500' : ''}
                        `}>
                          <Icon className="h-4 w-4 text-white" aria-hidden="true" />
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div className="min-w-0 flex-1">
                          <Link 
                            href={link}
                            className="text-sm text-neutral-900 hover:text-primary-600 transition-colors"
                          >
                            {activity.descripcion}
                          </Link>
                          {activity.entidad_nombre && (
                            <p className="text-xs text-neutral-500 mt-1">
                              {activity.entidad_nombre}
                            </p>
                          )}
                          {activity.usuario && (
                            <div className="mt-2">
                              <Badge variant="neutral" size="sm">
                                {activity.usuario}
                              </Badge>
                            </div>
                          )}
                        </div>
                        <div className="whitespace-nowrap text-right text-xs text-neutral-500">
                          <time dateTime={activity.fecha}>
                            {formatDate(new Date(activity.fecha), {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        
        <div className="mt-6 pt-4 border-t border-neutral-200">
          <Link
            href="/actividad"
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            Ver toda la actividad →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};