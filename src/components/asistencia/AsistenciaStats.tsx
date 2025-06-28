// src/components/asistencia/AsistenciaStats.tsx - Corregido
import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  CalendarIcon, 
  UsersIcon,
  ArrowTrendingUpIcon, // Corrección
  ArrowTrendingDownIcon, // Corrección
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { AsistenciaFilters } from './AsistenciaFilters';

interface AsistenciaStatsProps {
  filters: AsistenciaFilters;
  refreshTrigger?: number;
}

interface EstadisticasAsistencia {
  total_clases: number;
  total_catequizandos: number;
  promedio_asistencia: number;
  mejor_asistencia: number;
  peor_asistencia: number;
  tendencia: 'up' | 'down' | 'stable';
  catequizandos_riesgo: number;
}

interface AsistenciaPorFecha {
  fecha: string;
  presentes: number;
  ausentes: number;
  total: number;
  porcentaje: number;
}

interface AsistenciaPorGrupo {
  grupo: string;
  total_catequizandos: number;
  promedio_asistencia: number;
  clases_realizadas: number;
}

interface CatequizandoRiesgo {
  id_catequizando: number;
  nombres: string;
  apellidos: string;
  grupo: string;
  porcentaje_asistencia: number;
  total_ausencias: number;
}

const COLORS = ['#10B981', '#EF4444', '#F59E0B', '#3B82F6'];

export const AsistenciaStats: React.FC<AsistenciaStatsProps> = ({
  filters,
  refreshTrigger = 0,
}) => {
  const [loading, setLoading] = useState(true);
  const [estadisticas, setEstadisticas] = useState<EstadisticasAsistencia | null>(null);
  const [asistenciaPorFecha, setAsistenciaPorFecha] = useState<AsistenciaPorFecha[]>([]);
  const [asistenciaPorGrupo, setAsistenciaPorGrupo] = useState<AsistenciaPorGrupo[]>([]);
  const [catequizandosRiesgo, setCatequizandosRiesgo] = useState<CatequizandoRiesgo[]>([]);

  useEffect(() => {
    const loadEstadisticas = async () => {
      setLoading(true);
      try {
        // Simular llamada a la API - aquí irían las llamadas reales
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Datos simulados
        const mockEstadisticas: EstadisticasAsistencia = {
          total_clases: 8,
          total_catequizandos: 45,
          promedio_asistencia: 87.5,
          mejor_asistencia: 100,
          peor_asistencia: 65,
          tendencia: 'up',
          catequizandos_riesgo: 3,
        };

        const mockAsistenciaPorFecha: AsistenciaPorFecha[] = [
          { fecha: '2024-01-15', presentes: 40, ausentes: 5, total: 45, porcentaje: 88.9 },
          { fecha: '2024-01-22', presentes: 38, ausentes: 7, total: 45, porcentaje: 84.4 },
          { fecha: '2024-01-29', presentes: 42, ausentes: 3, total: 45, porcentaje: 93.3 },
          { fecha: '2024-02-05', presentes: 39, ausentes: 6, total: 45, porcentaje: 86.7 },
          { fecha: '2024-02-12', presentes: 43, ausentes: 2, total: 45, porcentaje: 95.6 },
          { fecha: '2024-02-19', presentes: 41, ausentes: 4, total: 45, porcentaje: 91.1 },
        ];

        const mockAsistenciaPorGrupo: AsistenciaPorGrupo[] = [
          { grupo: 'Grupo A - Iniciación', total_catequizandos: 15, promedio_asistencia: 92.3, clases_realizadas: 8 },
          { grupo: 'Grupo B - Iniciación', total_catequizandos: 12, promedio_asistencia: 85.7, clases_realizadas: 8 },
          { grupo: 'Grupo A - Reconciliación', total_catequizandos: 18, promedio_asistencia: 89.1, clases_realizadas: 8 },
        ];

        const mockCatequizandosRiesgo: CatequizandoRiesgo[] = [
          { id_catequizando: 1, nombres: 'María', apellidos: 'González', grupo: 'Grupo B - Iniciación', porcentaje_asistencia: 62.5, total_ausencias: 3 },
          { id_catequizando: 2, nombres: 'Pedro', apellidos: 'Martínez', grupo: 'Grupo A - Reconciliación', porcentaje_asistencia: 67.5, total_ausencias: 3 },
          { id_catequizando: 3, nombres: 'Ana', apellidos: 'López', grupo: 'Grupo B - Iniciación', porcentaje_asistencia: 70.0, total_ausencias: 2 },
        ];

        setEstadisticas(mockEstadisticas);
        setAsistenciaPorFecha(mockAsistenciaPorFecha);
        setAsistenciaPorGrupo(mockAsistenciaPorGrupo);
        setCatequizandosRiesgo(mockCatequizandosRiesgo);
      } catch (error) {
        console.error('Error loading statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEstadisticas();
  }, [filters, refreshTrigger]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="lg" text="Cargando estadísticas de asistencia..." />
      </div>
    );
  }

  if (!estadisticas) {
    return (
      <div className="text-center py-8 text-gray-500">
        No se pudieron cargar las estadísticas
      </div>
    );
  }

  const pieData = [
    { name: 'Asistencia', value: estadisticas.promedio_asistencia },
    { name: 'Ausencias', value: 100 - estadisticas.promedio_asistencia },
  ];

  return (
    <div className="space-y-6">
      {/* Tarjetas de estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <CalendarIcon className="h-8 w-8 text-blue-600 mr-4" />
            <div>
              <div className="text-sm font-medium text-gray-500">Total Clases</div>
              <div className="text-2xl font-bold text-gray-900">{estadisticas.total_clases}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <UsersIcon className="h-8 w-8 text-green-600 mr-4" />
            <div>
              <div className="text-sm font-medium text-gray-500">Total Catequizandos</div>
              <div className="text-2xl font-bold text-gray-900">{estadisticas.total_catequizandos}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <ChartBarIcon className="h-8 w-8 text-purple-600 mr-4" />
            <div>
              <div className="text-sm font-medium text-gray-500">Promedio Asistencia</div>
              <div className="flex items-center">
                <div className="text-2xl font-bold text-gray-900">{estadisticas.promedio_asistencia}%</div>
                {estadisticas.tendencia === 'up' ? (
                  <ArrowTrendingUpIcon className="h-5 w-5 text-green-500 ml-2" />
                ) : estadisticas.tendencia === 'down' ? (
                  <ArrowTrendingDownIcon className="h-5 w-5 text-red-500 ml-2" />
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600 mr-4" />
            <div>
              <div className="text-sm font-medium text-gray-500">En Riesgo</div>
              <div className="text-2xl font-bold text-gray-900">{estadisticas.catequizandos_riesgo}</div>
              <div className="text-xs text-red-600">Baja asistencia</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tendencia de asistencia */}
        <Card>
          <CardHeader>
            <CardTitle>Tendencia de Asistencia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={asistenciaPorFecha}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="fecha"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString('es-ES')}
                    formatter={(value) => [`${value}%`, 'Asistencia']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="porcentaje" 
                    stroke="#3B82F6" 
                    fill="#3B82F6"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Asistencia por grupo */}
        <Card>
          <CardHeader>
            <CardTitle>Asistencia por Grupo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={asistenciaPorGrupo} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis 
                    type="category" 
                    dataKey="grupo" 
                    tick={{ fontSize: 10 }}
                    width={120}
                  />
                  <Tooltip formatter={(value) => [`${value}%`, 'Asistencia']} />
                  <Bar dataKey="promedio_asistencia" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribución y catequizandos en riesgo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución de asistencia */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución General</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Asistencia ({estadisticas.promedio_asistencia}%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Ausencias ({(100 - estadisticas.promedio_asistencia).toFixed(1)}%)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Catequizandos en riesgo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
              <span>Catequizandos en Riesgo</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {catequizandosRiesgo.length > 0 ? (
                catequizandosRiesgo.map((catequizando) => (
                  <div key={catequizando.id_catequizando} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">
                        {catequizando.nombres} {catequizando.apellidos}
                      </div>
                      <div className="text-sm text-gray-600">{catequizando.grupo}</div>
                      <div className="text-xs text-red-600">
                        {catequizando.total_ausencias} ausencia{catequizando.total_ausencias !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant="error" 
                        size="sm"
                      >
                        {catequizando.porcentaje_asistencia}%
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No hay catequizandos en riesgo
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumen por rangos de asistencia */}
      <Card>
        <CardHeader>
          <CardTitle>Distribución por Rangos de Asistencia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">85%</div>
              <div className="text-sm text-green-700">Excelente (90-100%)</div>
              <div className="text-xs text-gray-600">32 catequizandos</div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">10%</div>
              <div className="text-sm text-blue-700">Buena (80-89%)</div>
              <div className="text-xs text-gray-600">8 catequizandos</div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">3%</div>
              <div className="text-sm text-yellow-700">Regular (70-79%)</div>
              <div className="text-xs text-gray-600">2 catequizandos</div>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">2%</div>
              <div className="text-sm text-red-700">Deficiente (&lt;70%)</div>
              <div className="text-xs text-gray-600">3 catequizandos</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AsistenciaStats;