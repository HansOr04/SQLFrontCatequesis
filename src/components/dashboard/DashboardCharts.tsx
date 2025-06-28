// src/components/dashboard/DashboardCharts.tsx
'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { CHART_COLORS } from '@/lib/constants';

interface ChartData {
  inscripciones_por_mes: {
    mes: string;
    inscripciones: number;
    año: number;
  }[];
  catequizandos_por_nivel: {
    nivel: string;
    catequizandos: number;
    porcentaje: number;
  }[];
  asistencia_por_grupo: {
    grupo: string;
    porcentaje_asistencia: number;
    total_catequizandos: number;
  }[];
}

interface DashboardChartsProps {
  data: ChartData | null;
  loading: boolean;
  error: string | null;
}

const COLORS = [
  CHART_COLORS.PRIMARY,
  CHART_COLORS.SECONDARY,
  CHART_COLORS.SUCCESS,
  CHART_COLORS.WARNING,
  CHART_COLORS.ERROR,
  CHART_COLORS.INFO,
];

export const DashboardCharts: React.FC<DashboardChartsProps> = ({
  data,
  loading,
  error,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="flex justify-center items-center h-80">
              <LoadingSpinner size="lg" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-600">Error al cargar gráficos: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-neutral-500">No hay datos disponibles para mostrar gráficos</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-neutral-200 rounded-lg shadow-lg">
          <p className="font-medium text-neutral-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.name.includes('porcentaje') ? '%' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Inscripciones por mes */}
      <Card>
        <CardHeader>
          <CardTitle>Inscripciones por Mes</CardTitle>
          <p className="text-sm text-neutral-600">
            Evolución de inscripciones durante el año
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.inscripciones_por_mes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="mes" 
                  stroke="#64748b"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="inscripciones" 
                  stroke={CHART_COLORS.PRIMARY}
                  strokeWidth={3}
                  dot={{ fill: CHART_COLORS.PRIMARY, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: CHART_COLORS.PRIMARY, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Catequizandos por nivel */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Nivel</CardTitle>
            <p className="text-sm text-neutral-600">
              Catequizandos activos por nivel de catequesis
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.catequizandos_por_nivel}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="catequizandos"
                    label={({ nivel, porcentaje }) => `${nivel} (${porcentaje}%)`}
                    labelLine={false}
                  >
                    {data.catequizandos_por_nivel.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Asistencia por grupo */}
        <Card>
          <CardHeader>
            <CardTitle>Asistencia por Grupo</CardTitle>
            <p className="text-sm text-neutral-600">
              Porcentaje de asistencia promedio por grupo
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.asistencia_por_grupo} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    type="number" 
                    domain={[0, 100]}
                    stroke="#64748b"
                    fontSize={12}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="grupo" 
                    width={100}
                    stroke="#64748b"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="porcentaje_asistencia" 
                    fill={CHART_COLORS.SUCCESS}
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};