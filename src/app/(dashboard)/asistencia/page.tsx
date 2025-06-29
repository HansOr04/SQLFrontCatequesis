// src/app/(dashboard)/asistencia/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CheckCircleIcon, 
  CalendarIcon,
  UserGroupIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import Select from '@/components/common/Select';
import Input from '@/components/common/Input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Badge } from '@/components/common/Badge';
import AsistenciaFilters, { AsistenciaFilters as Filters } from '@/components/asistencia/AsistenciaFilters';
import AsistenciaStats from '@/components/asistencia/AsistenciaStats';
import AsistenciaResumen from '@/components/asistencia/AsistenciaResumen';
import { Grupo } from '@/types/grupo';
import { Parroquia } from '@/types/parroquia';
import { Nivel } from '@/types/nivel';
import { usePermissions } from '@/hooks/usePermissions';
import { gruposService } from '@/services/grupos';
import { parroquiasService } from '@/services/parroquias';
import { nivelesService } from '@/services/niveles';

type TabType = 'registro' | 'estadisticas' | 'resumen';

export default function AsistenciaPage() {
  const router = useRouter();
  const { canManage } = usePermissions();
  
  // Estados principales
  const [activeTab, setActiveTab] = useState<TabType>('registro');
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [parroquias, setParroquias] = useState<Parroquia[]>([]);
  const [niveles, setNiveles] = useState<Nivel[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para registro de asistencia
  const [selectedGrupo, setSelectedGrupo] = useState<number | null>(null);
  const [selectedFecha, setSelectedFecha] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  
  // Estados para filtros
  const [filters, setFilters] = useState<Filters>({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [gruposRes, parroquiasRes, nivelesRes] = await Promise.allSettled([
        gruposService.getAll(),
        parroquiasService.getAll(),
        nivelesService.getAll(),
      ]);

      if (gruposRes.status === 'fulfilled' && gruposRes.value.success) {
        setGrupos(gruposRes.value.data);
      }

      if (parroquiasRes.status === 'fulfilled' && parroquiasRes.value.success) {
        setParroquias(parroquiasRes.value.data);
      }

      if (nivelesRes.status === 'fulfilled' && nivelesRes.value.success) {
        setNiveles(nivelesRes.value.data);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleIniciarRegistro = () => {
    if (selectedGrupo && selectedFecha) {
      router.push(`/asistencia/${selectedGrupo}?fecha=${selectedFecha}`);
    }
  };

  const tabs = [
    {
      key: 'registro',
      label: 'Registro de Asistencia',
      icon: ClipboardDocumentListIcon,
      description: 'Registrar asistencia para un grupo específico'
    },
    {
      key: 'estadisticas',
      label: 'Estadísticas',
      icon: ChartBarIcon,
      description: 'Ver métricas y tendencias de asistencia'
    },
    {
      key: 'resumen',
      label: 'Resumen',
      icon: UserGroupIcon,
      description: 'Resumen por catequizando y grupo'
    }
  ];

  const grupoOptions = grupos.map(g => ({
    value: g.id_grupo.toString(),
    label: g.nombre,
    description: `${g.nombre_parroquia} - ${g.nombre_nivel} (${g.total_inscripciones || 0} catequizandos)`
  }));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando módulo de asistencia..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <CheckCircleIcon className="h-8 w-8 text-primary-600" />
            <span>Gestión de Asistencia</span>
          </h1>
          <p className="text-gray-600 mt-1">
            Registra y monitorea la asistencia de los catequizandos
          </p>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="text-center p-6">
            <div className="text-3xl font-bold text-blue-600">87.5%</div>
            <div className="text-sm text-gray-600">Asistencia Promedio</div>
            <div className="text-xs text-gray-500 mt-1">Último mes</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="text-center p-6">
            <div className="text-3xl font-bold text-green-600">245</div>
            <div className="text-sm text-gray-600">Clases Registradas</div>
            <div className="text-xs text-gray-500 mt-1">Este periodo</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="text-center p-6">
            <div className="text-3xl font-bold text-yellow-600">12</div>
            <div className="text-sm text-gray-600">En Riesgo</div>
            <div className="text-xs text-gray-500 mt-1">Baja asistencia</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="text-center p-6">
            <div className="text-3xl font-bold text-purple-600">15</div>
            <div className="text-sm text-gray-600">Grupos Activos</div>
            <div className="text-xs text-gray-500 mt-1">Con registro</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <AsistenciaFilters
        parroquias={parroquias}
        niveles={niveles}
        grupos={grupos}
        onFiltersChange={handleFiltersChange}
        initialFilters={filters}
      />

      {/* Tabs de navegación */}
      <div>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as TabType)}
                  className={`
                    flex items-center py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                    ${activeTab === tab.key
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Contenido de tabs */}
        <div className="mt-6">
          {activeTab === 'registro' && (
            <div className="space-y-6">
              {/* Selector de grupo y fecha */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ClipboardDocumentListIcon className="h-5 w-5 text-primary-600" />
                    <span>Iniciar Registro de Asistencia</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <UserGroupIcon className="h-4 w-4 inline mr-1" />
                        Seleccionar Grupo
                      </label>
                      <Select
                        options={[
                          { value: '', label: 'Seleccione un grupo...' },
                          ...grupoOptions
                        ]}
                        value={selectedGrupo?.toString() || ''}
                        onChange={(value) => setSelectedGrupo(value ? Number(value) : null)}
                        placeholder="Buscar grupo..."
                        searchable
                        fullWidth
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <CalendarIcon className="h-4 w-4 inline mr-1" />
                        Fecha de Clase
                      </label>
                      <Input
                        type="date"
                        value={selectedFecha}
                        onChange={(e) => setSelectedFecha(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        fullWidth
                      />
                    </div>
                  </div>
                  
                  {/* Información del grupo seleccionado */}
                  {selectedGrupo && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      {(() => {
                        const grupo = grupos.find(g => g.id_grupo === selectedGrupo);
                        return grupo ? (
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-blue-900">{grupo.nombre}</div>
                              <div className="text-sm text-blue-700">
                                {grupo.nombre_parroquia} - {grupo.nombre_nivel}
                              </div>
                              <div className="text-sm text-blue-600">
                                {grupo.total_inscripciones || 0} catequizandos inscritos
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="primary">{grupo.periodo}</Badge>
                              <Badge variant="secondary">
                                Orden {grupo.orden_nivel}
                              </Badge>
                            </div>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
                  
                  <div className="mt-6 flex justify-end">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleIniciarRegistro}
                      disabled={!selectedGrupo || !selectedFecha || !canManage('ASISTENCIA')}
                      icon={<PlayIcon className="h-5 w-5" />}
                    >
                      Iniciar Registro de Asistencia
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Accesos rápidos */}
              <Card>
                <CardHeader>
                  <CardTitle>Accesos Rápidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center space-y-2"
                      onClick={() => setActiveTab('resumen')}
                    >
                      <UserGroupIcon className="h-6 w-6" />
                      <span className="text-sm">Ver Resumen</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center space-y-2"
                      onClick={() => setActiveTab('estadisticas')}
                    >
                      <ChartBarIcon className="h-6 w-6" />
                      <span className="text-sm">Estadísticas</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center space-y-2"
                      onClick={() => router.push('/asistencia/reportes')}
                    >
                      <ClipboardDocumentListIcon className="h-6 w-6" />
                      <span className="text-sm">Reportes</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'estadisticas' && (
            <AsistenciaStats 
              filters={filters}
              refreshTrigger={refreshTrigger}
            />
          )}

          {activeTab === 'resumen' && (
            <AsistenciaResumen 
              filters={filters}
              refreshTrigger={refreshTrigger}
            />
          )}
        </div>
      </div>
    </div>
  );
}