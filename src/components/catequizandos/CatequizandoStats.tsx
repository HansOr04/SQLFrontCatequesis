// src/components/catequizandos/CatequizandoStats.tsx
'use client';

import React from 'react';
import { 
  UsersIcon, 
  AcademicCapIcon, 
  HomeIcon,
  CalendarIcon,
  ChartBarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { StatsCard } from '@/components/common/Card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CatequizandoStats as StatsType } from '@/types/catequizando';

interface CatequizandoStatsProps {
  data: StatsType | null;
  loading?: boolean;
  error?: string | null;
}

export const CatequizandoStats: React.FC<CatequizandoStatsProps> = ({
  data,
  loading = false,
  error
}) => {
  // Colores para los gráficos
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316', '#06B6D4'];

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error al cargar estadísticas</h3>
            <p className="mt-2 text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay datos disponibles</h3>
        <p className="mt-1 text-sm text-gray-500">
          No se pudieron cargar las estadísticas de catequizandos.
        </p>
      </div>
    );
  }

  // Preparar datos para gráficos por edad usando los campos del backend
  const edadData = [
    { nombre: 'Niños (6-12)', cantidad: data.ninos, color: COLORS[0] },
    { nombre: 'Adolescentes (13-17)', cantidad: data.adolescentes, color: COLORS[1] },
    { nombre: 'Adultos (18+)', cantidad: data.adultos, color: COLORS[2] }
  ];

  return (
    <div className="space-y-6">
      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Catequizandos"
          value={data.total_catequizandos}
          icon={<UsersIcon className="h-6 w-6" />}
          color="primary"
          className="hover-lift"
        />
        
        <StatsCard
          title="Casos Especiales"
          value={data.casos_especiales}
          icon={<ExclamationTriangleIcon className="h-6 w-6" />}
          color="warning"
          className="hover-lift"
        />
        
        <StatsCard
          title="Sin Inscripciones"
          value={data.sin_inscripciones}
          icon={<ExclamationTriangleIcon className="h-6 w-6" />}
          color="error"
          className="hover-lift"
        />
        
        <StatsCard
          title="Activos Este Año"
          value={data.activos_este_ano}
          icon={<ChartBarIcon className="h-6 w-6" />}
          color="success"
          trend={{
            value: 12,
            direction: 'up',
            period: 'vs año anterior'
          }}
          className="hover-lift"
        />
      </div>

      {/* Gráfico de distribución por edad */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2" />
            Distribución por Edad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={edadData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ nombre, cantidad }) => `${nombre}: ${cantidad}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="cantidad"
                >
                  {edadData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any, name: any) => [value, 'Catequizandos']}
                  labelFormatter={(label: any) => `Grupo: ${label}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Leyenda */}
          <div className="mt-4 space-y-2">
            {edadData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.nombre}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{item.cantidad}</span>
                  <span className="text-gray-500">
                    ({Math.round((item.cantidad / data.total_catequizandos) * 100)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de barras por edad */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ChartBarIcon className="h-5 w-5 mr-2" />
            Comparación por Grupos de Edad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={edadData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="nombre" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [value, 'Catequizandos']}
                  labelFormatter={(label: any) => `Grupo: ${label}`}
                />
                <Bar dataKey="cantidad" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Resumen de alertas */}
      {(data.sin_inscripciones > 0 || data.casos_especiales > 0) && (
        <Card className="border-l-4 border-l-yellow-400">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-800">
              <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
              Alertas y Casos Especiales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.sin_inscripciones > 0 && (
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium text-yellow-800">
                      Catequizandos sin inscripción
                    </p>
                    <p className="text-sm text-yellow-700">
                      Hay {data.sin_inscripciones} catequizando{data.sin_inscripciones > 1 ? 's' : ''} 
                      sin inscripciones registradas
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {data.sin_inscripciones}
                  </div>
                </div>
              )}

              {data.casos_especiales > 0 && (
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-red-800">Casos especiales</p>
                    <p className="text-sm text-red-700">
                      {data.casos_especiales} catequizando{data.casos_especiales > 1 ? 's' : ''} 
                      marcado{data.casos_especiales > 1 ? 's' : ''} como caso{data.casos_especiales > 1 ? 's' : ''} especial{data.casos_especiales > 1 ? 'es' : ''}
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-red-600">
                    {data.casos_especiales}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estadísticas de rendimiento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ChartBarIcon className="h-5 w-5 mr-2" />
            Resumen General
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total activos */}
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {data.activos_este_ano}
              </div>
              <p className="text-sm text-gray-600">Activos Este Año</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ 
                    width: `${Math.min((data.activos_este_ano / data.total_catequizandos) * 100, 100)}%` 
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {Math.round((data.activos_este_ano / data.total_catequizandos) * 100)}% del total
              </p>
            </div>

            {/* Sin inscripciones */}
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {data.sin_inscripciones}
              </div>
              <p className="text-sm text-gray-600">Sin Inscripciones</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: `${(data.sin_inscripciones / data.total_catequizandos) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {Math.round((data.sin_inscripciones / data.total_catequizandos) * 100)}% del total
              </p>
            </div>

            {/* Casos especiales */}
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {data.casos_especiales}
              </div>
              <p className="text-sm text-gray-600">Casos Especiales</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{ width: `${(data.casos_especiales / data.total_catequizandos) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {Math.round((data.casos_especiales / data.total_catequizandos) * 100)}% del total
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};