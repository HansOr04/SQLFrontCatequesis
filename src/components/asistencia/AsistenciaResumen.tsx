// src/components/asistencia/AsistenciaResumen.tsx
import React, { useState, useEffect } from 'react';
import { 
  UserIcon, 
  CalendarIcon, 
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Table } from '@/components/common/Table';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import  SearchInput  from '@/components/common/SearchInput';
import { AsistenciaFilters } from './AsistenciaFilters';

interface AsistenciaResumenProps {
  filters: AsistenciaFilters;
  refreshTrigger?: number;
}

interface ResumenCatequizando {
  id_catequizando: number;
  nombres: string;
  apellidos: string;
  documento_identidad: string;
  grupo: string;
  total_clases: number;
  total_asistencias: number;
  total_ausencias: number;
  porcentaje_asistencia: number;
  ultima_asistencia: string | null;
  estado_asistencia: 'excelente' | 'buena' | 'regular' | 'deficiente';
  en_riesgo: boolean;
}

interface EstadisticasResumen {
  total_catequizandos: number;
  promedio_general: number;
  excelente: number;
  buena: number;
  regular: number;
  deficiente: number;
}

export const AsistenciaResumen: React.FC<AsistenciaResumenProps> = ({
  filters,
  refreshTrigger = 0,
}) => {
  const [loading, setLoading] = useState(true);
  const [resumenCatequizandos, setResumenCatequizandos] = useState<ResumenCatequizando[]>([]);
  const [estadisticasResumen, setEstadisticasResumen] = useState<EstadisticasResumen | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState<ResumenCatequizando[]>([]);

  useEffect(() => {
    const loadResumen = async () => {
      setLoading(true);
      try {
        // Simular llamada a la API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockResumen: ResumenCatequizando[] = [
          {
            id_catequizando: 1,
            nombres: 'María',
            apellidos: 'González',
            documento_identidad: '1234567890',
            grupo: 'Grupo A - Iniciación',
            total_clases: 8,
            total_asistencias: 7,
            total_ausencias: 1,
            porcentaje_asistencia: 87.5,
            ultima_asistencia: '2024-02-19',
            estado_asistencia: 'buena',
            en_riesgo: false,
          },
          {
            id_catequizando: 2,
            nombres: 'Pedro',
            apellidos: 'Martínez',
            documento_identidad: '0987654321',
            grupo: 'Grupo A - Iniciación',
            total_clases: 8,
            total_asistencias: 8,
            total_ausencias: 0,
            porcentaje_asistencia: 100,
            ultima_asistencia: '2024-02-19',
            estado_asistencia: 'excelente',
            en_riesgo: false,
          },
          {
            id_catequizando: 3,
            nombres: 'Ana',
            apellidos: 'López',
            documento_identidad: '1357924680',
            grupo: 'Grupo B - Iniciación',
            total_clases: 8,
            total_asistencias: 5,
            total_ausencias: 3,
            porcentaje_asistencia: 62.5,
            ultima_asistencia: '2024-02-05',
            estado_asistencia: 'deficiente',
            en_riesgo: true,
          },
          {
            id_catequizando: 4,
            nombres: 'Carlos',
            apellidos: 'Rodríguez',
            documento_identidad: '2468135790',
            grupo: 'Grupo A - Reconciliación',
            total_clases: 8,
            total_asistencias: 6,
            total_ausencias: 2,
            porcentaje_asistencia: 75.0,
            ultima_asistencia: '2024-02-12',
            estado_asistencia: 'regular',
            en_riesgo: false,
          },
          {
            id_catequizando: 5,
            nombres: 'Sofía',
            apellidos: 'Hernández',
            documento_identidad: '1122334455',
            grupo: 'Grupo A - Reconciliación',
            total_clases: 8,
            total_asistencias: 7,
            total_ausencias: 1,
            porcentaje_asistencia: 87.5,
            ultima_asistencia: '2024-02-19',
            estado_asistencia: 'buena',
            en_riesgo: false,
          },
        ];

        const mockEstadisticas: EstadisticasResumen = {
          total_catequizandos: 45,
          promedio_general: 84.2,
          excelente: 32,
          buena: 8,
          regular: 2,
          deficiente: 3,
        };

        setResumenCatequizandos(mockResumen);
        setEstadisticasResumen(mockEstadisticas);
      } catch (error) {
        console.error('Error loading resumen:', error);
      } finally {
        setLoading(false);
      }
    };

    loadResumen();
  }, [filters, refreshTrigger]);

  // Filtrar datos basado en búsqueda
  useEffect(() => {
    if (!searchQuery) {
      setFilteredData(resumenCatequizandos);
    } else {
      const filtered = resumenCatequizandos.filter(catequizando =>
        catequizando.nombres.toLowerCase().includes(searchQuery.toLowerCase()) ||
        catequizando.apellidos.toLowerCase().includes(searchQuery.toLowerCase()) ||
        catequizando.documento_identidad.includes(searchQuery) ||
        catequizando.grupo.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [resumenCatequizandos, searchQuery]);

  const getEstadoBadge = (estado: string, enRiesgo: boolean) => {
    if (enRiesgo) {
      return <Badge variant="error" size="sm">En Riesgo</Badge>;
    }
    
    switch (estado) {
      case 'excelente':
        return <Badge variant="success" size="sm">Excelente</Badge>;
      case 'buena':
        return <Badge variant="primary" size="sm">Buena</Badge>;
      case 'regular':
        return <Badge variant="warning" size="sm">Regular</Badge>;
      case 'deficiente':
        return <Badge variant="error" size="sm">Deficiente</Badge>;
      default:
        return <Badge variant="secondary" size="sm">Sin datos</Badge>;
    }
  };

  const getAsistenciaColor = (porcentaje: number) => {
    if (porcentaje >= 90) return 'text-green-600';
    if (porcentaje >= 80) return 'text-blue-600';
    if (porcentaje >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const tableColumns = [
    {
      key: 'catequizando',
      title: 'Catequizando',
      render: (item: ResumenCatequizando) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              <UserIcon className="h-5 w-5 text-gray-600" />
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {item.nombres} {item.apellidos}
            </div>
            <div className="text-sm text-gray-500">CI: {item.documento_identidad}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'grupo',
      title: 'Grupo',
      render: (item: ResumenCatequizando) => (
        <span className="text-sm text-gray-900">{item.grupo}</span>
      ),
    },
    {
      key: 'asistencia',
      title: 'Asistencia',
      render: (item: ResumenCatequizando) => (
        <div className="text-center">
          <div className={`text-lg font-bold ${getAsistenciaColor(item.porcentaje_asistencia)}`}>
            {item.porcentaje_asistencia}%
          </div>
          <div className="text-xs text-gray-500">
            {item.total_asistencias}/{item.total_clases} clases
          </div>
        </div>
      ),
    },
    {
      key: 'ultima_asistencia',
      title: 'Última Asistencia',
      render: (item: ResumenCatequizando) => (
        <div className="text-sm text-gray-600">
          {item.ultima_asistencia 
            ? new Date(item.ultima_asistencia).toLocaleDateString('es-ES')
            : 'Sin registro'
          }
        </div>
      ),
    },
    {
      key: 'estado',
      title: 'Estado',
      render: (item: ResumenCatequizando) => 
        getEstadoBadge(item.estado_asistencia, item.en_riesgo),
    },
    {
      key: 'actions',
      title: 'Acciones',
      render: (item: ResumenCatequizando) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {/* Ver detalle */}}
          >
            Ver Detalle
          </Button>
        </div>
      ),
    },
  ];

  const exportToCSV = () => {
    const headers = ['Nombres', 'Apellidos', 'Documento', 'Grupo', 'Total Clases', 'Asistencias', 'Ausencias', 'Porcentaje', 'Estado'];
    const data = filteredData.map(item => [
      item.nombres,
      item.apellidos,
      item.documento_identidad,
      item.grupo,
      item.total_clases,
      item.total_asistencias,
      item.total_ausencias,
      `${item.porcentaje_asistencia}%`,
      item.estado_asistencia,
    ]);

    const csvContent = [headers, ...data]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `resumen_asistencia_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="lg" text="Cargando resumen de asistencia..." />
      </div>
    );
  }

  if (!estadisticasResumen) {
    return (
      <div className="text-center py-8 text-gray-500">
        No se pudieron cargar los datos del resumen
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas generales */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="text-center p-4">
            <div className="text-2xl font-bold text-gray-900">{estadisticasResumen.total_catequizandos}</div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center p-4">
            <div className="text-2xl font-bold text-blue-600">{estadisticasResumen.promedio_general}%</div>
            <div className="text-sm text-gray-600">Promedio</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center p-4">
            <CheckCircleIcon className="h-6 w-6 text-green-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-green-600">{estadisticasResumen.excelente}</div>
            <div className="text-xs text-gray-600">Excelente</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center p-4">
            <ChartBarIcon className="h-6 w-6 text-blue-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-blue-600">{estadisticasResumen.buena}</div>
            <div className="text-xs text-gray-600">Buena</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center p-4">
            <ClockIcon className="h-6 w-6 text-yellow-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-yellow-600">{estadisticasResumen.regular}</div>
            <div className="text-xs text-gray-600">Regular</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center p-4">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-red-600">{estadisticasResumen.deficiente}</div>
            <div className="text-xs text-gray-600">Deficiente</div>
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 max-w-md">
              <SearchInput
                placeholder="Buscar catequizando..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {filteredData.length} de {resumenCatequizandos.length} registros
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={exportToCSV}
                icon={<DocumentArrowDownIcon className="h-4 w-4" />}
              >
                Exportar CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de resumen */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserIcon className="h-5 w-5 text-primary-600" />
            <span>Resumen por Catequizando</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredData.length > 0 ? (
            <Table
              columns={tableColumns}
              data={filteredData}
              keyExtractor={(item: ResumenCatequizando) => item.id_catequizando.toString()}
            />
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-2">
                {searchQuery ? 'No se encontraron resultados' : 'No hay datos disponibles'}
              </div>
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                >
                  Limpiar búsqueda
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Leyenda de estados */}
      <Card>
        <CardHeader>
          <CardTitle>Criterios de Evaluación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
              <div>
                <div className="font-medium text-green-900">Excelente</div>
                <div className="text-sm text-green-700">90% - 100%</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-blue-600" />
              <div>
                <div className="font-medium text-blue-900">Buena</div>
                <div className="text-sm text-blue-700">80% - 89%</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
              <div>
                <div className="font-medium text-yellow-900">Regular</div>
                <div className="text-sm text-yellow-700">70% - 79%</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              <div>
                <div className="font-medium text-red-900">Deficiente</div>
                <div className="text-sm text-red-700">Menor a 70%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AsistenciaResumen;