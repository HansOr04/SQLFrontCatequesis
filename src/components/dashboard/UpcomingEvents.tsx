// src/components/dashboard/UpcomingEvents.tsx - Corregido
'use client';

import React from 'react';
import Link from 'next/link';
import { 
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { formatDateWithOptions } from '@/lib/utils';

interface Event {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  hora: string;
  ubicacion?: string;
  tipo: 'clase' | 'ceremonia' | 'reunion' | 'evaluacion' | 'retiro';
  grupo?: string;
  nivel?: string;
  prioridad: 'alta' | 'media' | 'baja';
  participantes?: number;
}

interface UpcomingEventsProps {
  events: Event[];
  loading: boolean;
  error: string | null;
}

const getEventIcon = (tipo: string) => {
  switch (tipo) {
    case 'clase':
      return UserGroupIcon;
    case 'ceremonia':
      return CalendarDaysIcon;
    case 'reunion':
      return ClockIcon;
    case 'evaluacion':
      return ExclamationTriangleIcon;
    case 'retiro':
      return MapPinIcon;
    default:
      return CalendarDaysIcon;
  }
};

const getEventColor = (tipo: string) => {
  switch (tipo) {
    case 'clase':
      return 'primary';
    case 'ceremonia':
      return 'success';
    case 'reunion':
      return 'warning';
    case 'evaluacion':
      return 'error';
    case 'retiro':
      return 'secondary';
    default:
      return 'neutral';
  }
};

const getPriorityColor = (prioridad: string) => {
  switch (prioridad) {
    case 'alta':
      return 'error';
    case 'media':
      return 'warning';
    case 'baja':
      return 'success';
    default:
      return 'neutral';
  }
};

const formatEventDate = (fecha: string, hora: string) => {
  const date = new Date(fecha);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return `Hoy a las ${hora}`;
  } else if (diffDays === 1) {
    return `Mañana a las ${hora}`;
  } else if (diffDays <= 7) {
    return `En ${diffDays} días (${hora})`;
  } else {
    return `${formatDateWithOptions(fecha, { month: 'short', day: 'numeric' })} a las ${hora}`;
  }
};

export const UpcomingEvents: React.FC<UpcomingEventsProps> = ({
  events,
  loading,
  error,
}) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Próximos Eventos</CardTitle>
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
          <CardTitle>Próximos Eventos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-red-600">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!events || events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Próximos Eventos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
              <CalendarDaysIcon className="w-6 h-6 text-neutral-400" />
            </div>
            <p className="text-neutral-500">No hay eventos próximos programados</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximos Eventos</CardTitle>
        <p className="text-sm text-neutral-600">
          Actividades programadas para los próximos días
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.slice(0, 5).map((event) => {
            const Icon = getEventIcon(event.tipo);
            const eventColor = getEventColor(event.tipo);
            const priorityColor = getPriorityColor(event.prioridad);

            return (
              <div
                key={event.id}
                className="relative flex items-start space-x-3 p-4 border border-neutral-200 rounded-lg hover:border-neutral-300 hover:shadow-sm transition-all duration-200"
              >
                {/* Indicador de prioridad */}
                <div className={`
                  absolute left-0 top-0 bottom-0 w-1 rounded-l-lg
                  ${priorityColor === 'error' ? 'bg-error-500' : ''}
                  ${priorityColor === 'warning' ? 'bg-warning-500' : ''}
                  ${priorityColor === 'success' ? 'bg-success-500' : ''}
                `} />

                {/* Icono */}
                <div className={`
                  flex-shrink-0 rounded-full p-2
                  ${eventColor === 'primary' ? 'bg-primary-100 text-primary-600' : ''}
                  ${eventColor === 'success' ? 'bg-success-100 text-success-600' : ''}
                  ${eventColor === 'warning' ? 'bg-warning-100 text-warning-600' : ''}
                  ${eventColor === 'error' ? 'bg-error-100 text-error-600' : ''}
                  ${eventColor === 'secondary' ? 'bg-secondary-100 text-secondary-600' : ''}
                `}>
                  <Icon className="h-4 w-4" />
                </div>

                {/* Contenido */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-medium text-neutral-900 truncate">
                        {event.titulo}
                      </h4>
                      <p className="text-xs text-neutral-500 mt-1">
                        {event.descripcion}
                      </p>
                    </div>
                    <div className="flex flex-col items-end space-y-1 ml-2">
                      <Badge variant={eventColor} size="sm">
                        {event.tipo}
                      </Badge>
                      {event.prioridad === 'alta' && (
                        <Badge variant="error" size="sm">
                          Urgente
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Información adicional */}
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-neutral-600">
                    <div className="flex items-center">
                      <ClockIcon className="h-3 w-3 mr-1" />
                      {formatEventDate(event.fecha, event.hora)}
                    </div>
                    
                    {event.ubicacion && (
                      <div className="flex items-center">
                        <MapPinIcon className="h-3 w-3 mr-1" />
                        {event.ubicacion}
                      </div>
                    )}
                    
                    {event.grupo && (
                      <div className="flex items-center">
                        <UserGroupIcon className="h-3 w-3 mr-1" />
                        {event.grupo}
                      </div>
                    )}
                    
                    {event.participantes && (
                      <div className="flex items-center">
                        <span className="w-3 h-3 bg-neutral-400 rounded-full mr-1 flex items-center justify-center">
                          <span className="w-1 h-1 bg-white rounded-full"></span>
                        </span>
                        {event.participantes} participantes
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {events.length > 5 && (
          <div className="mt-6 pt-4 border-t border-neutral-200">
            <Link
              href="/calendario"
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              Ver todos los eventos ({events.length}) →
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};