// src/components/grupos/GrupoStats.tsx
import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  CalendarIcon, 
  UserGroupIcon,
  ArrowTrendingUpIcon, // Corrección
  ArrowTrendingDownIcon // Corrección
} from '@heroicons/react/24/outline';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
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
  Cell
} from 'recharts';

interface GrupoStatsProps {
  grupoId: number;
}

interface AsistenciaStats {
  fecha: string;
  presentes: number;
  ausentes: number;
  porcentaje: number;
}

interface EstadisticasGenerales {
  total_catequizandos: number;
  promedio_asistencia: number;
  clases_realizadas: number;
  tendencia_asistencia: 'up' | 'down' | 'stable';
}

const COLORS = ['#10B981', '#EF4444', '#F59E0B'];

export const GrupoStats: React.FC<GrupoStatsProps> = ({ grupoId }) => {
  const [loading, setLoading] = useState(true);
  const [asistenciaData, setAsistenciaData] = useState<AsistenciaStats[]>([]);
  const [statsGenerales, setStatsGenerales] = useState<EstadisticasGenerales | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        // Simular datos - aquí irían las llamadas reales a la API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockAsistenciaData: AsistenciaStats[] = [
          { fecha: '2024-01-15', presentes: 18, ausentes: 2, porcentaje: 90 },
          { fecha: '2024-01-22', presentes: 16, ausentes: 4, porcentaje: 80 },
          { fecha: '2024-01-29', presentes: 19, ausentes: 1, porcentaje: 95 },
          { fecha: '2024-02-05', presentes: 17, ausentes: 3, porcentaje: 85 },
          { fecha: '2024-02-12', presentes: 20, ausentes: 0, porcentaje: 100 },
          { fecha: '2024-02-19', presentes: 18, ausentes: 2, porcentaje: 90 },
        ];

        const mockStatsGenerales: EstadisticasGenerales = {
          total_catequizandos: 20,
          promedio_asistencia: 88.3,
          clases_realizadas: 6,
          tendencia_asistencia: 'up'
        };

        setAsistenciaData(mockAsistenciaData);
        setStatsGenerales(mockStatsGenerales);
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [grupoId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="lg" text="Cargando estadísticas..." />
      </div>
    );
  }

  if (!statsGenerales) {
    return (
      <div className="text-center py-8 text-gray-500">
        No se pudieron cargar las estadísticas
      </div>
    );
  }

  const pieData = [
    { name: 'Asistencia Promedio', value: statsGenerales.promedio_asistencia },
    { name: 'Ausencias', value: 100 - statsGenerales.promedio_asistencia },
  ];

  return (
    <div className="space-y-6">
      {/* Tarjetas de estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <UserGroupIcon className="h-8 w-8 text-blue-600 mr-4" />
            <div>
              <div className="text-sm font-medium text-gray-500">Total Catequizandos</div>
              <div className="text-2xl font-bold text-gray-900">{statsGenerales.total_catequizandos}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <ChartBarIcon className="h-8 w-8 text-green-600 mr-4" />
            <div>
              <div className="text-sm font-medium text-gray-500">Promedio Asistencia</div>
              <div className="flex items-center">
                <div className="text-2xl font-bold text-gray-900">{statsGenerales.promedio_asistencia}%</div>
                {statsGenerales.tendencia_asistencia === 'up' ? (
                  <ArrowTrendingUpIcon className="h-5 w-5 text-green-500 ml-2" />
                ) : statsGenerales.tendencia_asistencia === 'down' ? (
                  <ArrowTrendingDownIcon className="h-5 w-5 text-red-500 ml-2" />
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <CalendarIcon className="h-8 w-8 text-purple-600 mr-4" />
            <div>
              <div className="text-sm font-medium text-gray-500">Clases Realizadas</div>
              <div className="text-2xl font-bold text-gray-900">{statsGenerales.clases_realizadas}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-orange-600 font-bold">%</span>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Mejor Asistencia</div>
              <div className="text-2xl font-bold text-gray-900">
                {Math.max(...asistenciaData.map(d => d.porcentaje))}%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de barras - Asistencia por fecha */}
        <Card>
          <CardHeader>
            <CardTitle>Asistencia por Clase</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={asistenciaData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="fecha" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString('es-ES')}
                  />
                  <Bar dataKey="presentes" stackId="a" fill="#10B981" name="Presentes" />
                  <Bar dataKey="ausentes" stackId="a" fill="#EF4444" name="Ausentes" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de línea - Tendencia de asistencia */}
        <Card>
          <CardHeader>
            <CardTitle>Tendencia de Asistencia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={asistenciaData}>
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
                  <Line 
                    type="monotone" 
                    dataKey="porcentaje" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico circular y tabla de resumen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico circular */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Asistencia</CardTitle>
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
                <span className="text-sm text-gray-600">Asistencia</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Ausencias</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de resumen */}
        <Card>
          <CardHeader>
            <CardTitle>Resumen por Clase</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {asistenciaData.map((clase, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">
                      {new Date(clase.fecha).toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="text-sm text-gray-500">
                      {clase.presentes} presentes, {clase.ausentes} ausentes
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      clase.porcentaje >= 90 ? 'text-green-600' :
                      clase.porcentaje >= 75 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {clase.porcentaje}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GrupoStats;