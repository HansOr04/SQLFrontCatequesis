// src/app/(dashboard)/dashboard/page.tsx
'use client';

import React from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/common/Button';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { UpcomingEvents } from '@/components/dashboard/UpcomingEvents';
import { useDashboard } from '@/hooks/useDashboard';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const {
    stats,
    activity,
    charts,
    events,
    isLoading,
    refresh
  } = useDashboard();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const getUserRoleDisplay = () => {
    const roles = {
      admin: 'Administrador del Sistema',
      parroco: 'Párroco',
      secretaria: 'Secretaria Parroquial',
      catequista: 'Catequista',
      consulta: 'Usuario de Consulta'
    };
    return roles[user?.tipo_perfil || 'consulta'];
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {getGreeting()}, {user?.username}
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            {getUserRoleDisplay()}
            {user?.nombre_parroquia && (
              <span className="text-gray-500"> • {user.nombre_parroquia}</span>
            )}
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            variant="outline"
            onClick={refresh}
            loading={isLoading}
            icon={<ArrowPathIcon className="h-4 w-4" />}
            iconPosition="left"
          >
            Actualizar
          </Button>
        </div>
      </div>

      {/* Estadísticas principales */}
      <section>
        <DashboardStats
          data={stats.data}
          loading={stats.loading}
          error={stats.error}
        />
      </section>

      {/* Layout de dos columnas */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Columna izquierda - 2/3 del ancho */}
        <div className="lg:col-span-2 space-y-8">
          {/* Gráficos */}
          <section>
            <DashboardCharts
              data={charts.data}
              loading={charts.loading}
              error={charts.error}
            />
          </section>

          {/* Actividad reciente */}
          <section>
            <RecentActivity
              activities={activity.data}
              loading={activity.loading}
              error={activity.error}
            />
          </section>
        </div>

        {/* Columna derecha - 1/3 del ancho */}
        <div className="space-y-8">
          {/* Acciones rápidas */}
          <section>
            <QuickActions />
          </section>

          {/* Próximos eventos */}
          <section>
            <UpcomingEvents
              events={events.data}
              loading={events.loading}
              error={events.error}
            />
          </section>
        </div>
      </div>

      {/* Información adicional para móviles */}
      <div className="lg:hidden">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Tip de navegación
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Usa el menú lateral para acceder a todas las funciones del sistema.
                  Desliza desde la izquierda o toca el botón de menú en la parte superior.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}