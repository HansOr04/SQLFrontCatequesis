// src/components/dashboard/DashboardStats.tsx
'use client';

import React from 'react';
import { 
  UsersIcon, 
  AcademicCapIcon, 
  UserGroupIcon, 
  DocumentTextIcon,
  CheckCircleIcon,
  BuildingLibraryIcon
} from '@heroicons/react/24/outline';
import { StatsCard } from '@/components/common/Card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';

interface DashboardStatsData {
  total_catequizandos: number;
  total_catequistas: number;
  total_grupos: number;
  total_inscripciones: number;
  porcentaje_asistencia_promedio: number;
  certificados_pendientes: number;
  parroquias_activas?: number;
}

interface DashboardStatsProps {
  data: DashboardStatsData | null;
  loading: boolean;
  error: string | null;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  data,
  loading,
  error,
}) => {
  const { user } = useAuth();
  const isAdmin = user?.tipo_perfil === 'admin';

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: isAdmin ? 6 : 5 }).map((_, index) => (
          <div key={index} className="bg-white overflow-hidden shadow rounded-lg animate-pulse">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error al cargar estadísticas
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No hay datos disponibles</p>
      </div>
    );
  }

  // Tipo para las estadísticas individuales
  interface StatItem {
    name: string;
    value: number | string;
    icon: React.ComponentType<any>;
    color: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
    trend?: {
      value: number;
      direction: 'up' | 'down';
      period: string;
    };
  }

  const stats: StatItem[] = [
    {
      name: 'Catequizandos',
      value: data.total_catequizandos,
      icon: UsersIcon,
      color: 'primary',
      trend: {
        value: 12,
        direction: 'up',
        period: 'vs mes anterior'
      }
    },
    {
      name: 'Catequistas',
      value: data.total_catequistas,
      icon: AcademicCapIcon,
      color: 'secondary',
    },
    {
      name: 'Grupos Activos',
      value: data.total_grupos,
      icon: UserGroupIcon,
      color: 'success',
    },
    {
      name: 'Inscripciones',
      value: data.total_inscripciones,
      icon: DocumentTextIcon,
      color: 'warning',
      trend: {
        value: 8,
        direction: 'up',
        period: 'este mes'
      }
    },
    {
      name: 'Asistencia Promedio',
      value: `${Math.round(data.porcentaje_asistencia_promedio)}%`,
      icon: CheckCircleIcon,
      color: data.porcentaje_asistencia_promedio >= 80 ? 'success' : 
            data.porcentaje_asistencia_promedio >= 60 ? 'warning' : 'error',
      trend: {
        value: data.porcentaje_asistencia_promedio >= 80 ? 3 : 2,
        direction: data.porcentaje_asistencia_promedio >= 80 ? 'up' : 'down',
        period: 'vs mes anterior'
      }
    },
  ];

  // Agregar estadística de parroquias solo para admin
  if (isAdmin && data.parroquias_activas !== undefined) {
    stats.push({
      name: 'Parroquias Activas',
      value: data.parroquias_activas,
      icon: BuildingLibraryIcon,
      color: 'primary',
    });
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatsCard
          key={stat.name}
          title={stat.name}
          value={stat.value}
          icon={<stat.icon className="h-6 w-6" />}
          color={stat.color}
          trend={stat.trend}
          className="hover-lift"
        />
      ))}
    </div>
  );
};