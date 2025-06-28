// src/components/asistencia/AsistenciaFilters.tsx
import React, { useState, useEffect } from 'react';
import { 
  FunnelIcon, 
  CalendarIcon, 
  HomeIcon,
  AcademicCapIcon,
  UserGroupIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import Select from '@/components/common/Select';
import Input from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';
import { Parroquia } from '@/types/parroquia';
import { Nivel } from '@/types/nivel';
import { Grupo } from '@/types/grupo';

interface AsistenciaFiltersProps {
  parroquias: Parroquia[];
  niveles: Nivel[];
  grupos: Grupo[];
  onFiltersChange: (filters: AsistenciaFilters) => void;
  initialFilters?: Partial<AsistenciaFilters>;
  loading?: boolean;
}

export interface AsistenciaFilters {
  parroquia?: number;
  nivel?: number;
  grupo?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
  periodo?: string;
  porcentaje_minimo?: number;
}

export const AsistenciaFilters: React.FC<AsistenciaFiltersProps> = ({
  parroquias,
  niveles,
  grupos,
  onFiltersChange,
  initialFilters = {},
  loading = false,
}) => {
  const [filters, setFilters] = useState<AsistenciaFilters>(initialFilters);
  const [gruposFiltrados, setGruposFiltrados] = useState<Grupo[]>(grupos);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Filtrar grupos basado en parroquia y nivel seleccionados
  useEffect(() => {
    let filtrados = [...grupos];
    
    if (filters.parroquia) {
      filtrados = filtrados.filter(g => g.id_parroquia === filters.parroquia);
    }
    
    if (filters.nivel) {
      filtrados = filtrados.filter(g => g.id_nivel === filters.nivel);
    }
    
    setGruposFiltrados(filtrados);
    
    // Si el grupo seleccionado ya no está en la lista filtrada, limpiarlo
    if (filters.grupo && !filtrados.find(g => g.id_grupo === filters.grupo)) {
      setFilters(prev => ({ ...prev, grupo: undefined }));
    }
  }, [filters.parroquia, filters.nivel, grupos]);

  // Emitir cambios de filtros
  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const updateFilter = (key: keyof AsistenciaFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '');
  const activeFilterCount = Object.values(filters).filter(value => value !== undefined && value !== '').length;

  const parroquiaOptions = parroquias.map(p => ({
    value: p.id_parroquia.toString(),
    label: p.nombre,
  }));

  const nivelOptions = niveles.map(n => ({
    value: n.id_nivel.toString(),
    label: n.nombre,
  }));

  const grupoOptions = gruposFiltrados.map(g => ({
    value: g.id_grupo.toString(),
    label: g.nombre,
    description: `${g.nombre_parroquia} - ${g.periodo}`,
  }));

  const currentYear = new Date().getFullYear();
  const periodoOptions = [
    { value: currentYear.toString(), label: currentYear.toString() },
    { value: `${currentYear}-${currentYear + 1}`, label: `${currentYear}-${currentYear + 1}` },
    { value: (currentYear - 1).toString(), label: (currentYear - 1).toString() },
    { value: `${currentYear - 1}-${currentYear}`, label: `${currentYear - 1}-${currentYear}` },
  ];

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-medium text-gray-900">Filtros de Asistencia</h3>
              {hasActiveFilters && (
                <Badge variant="primary" size="sm">
                  {activeFilterCount} activo{activeFilterCount !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                {showAdvanced ? 'Filtros Básicos' : 'Filtros Avanzados'}
              </Button>
              
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  icon={<XMarkIcon className="h-4 w-4" />}
                >
                  Limpiar Filtros
                </Button>
              )}
            </div>
          </div>

          {/* Filtros Básicos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <UserGroupIcon className="h-4 w-4 inline mr-1" />
                Grupo
              </label>
              <Select
                options={[{ value: '', label: 'Todos los grupos' }, ...grupoOptions]}
                value={filters.grupo?.toString() || ''}
                onChange={(value) => updateFilter('grupo', value ? Number(value) : undefined)}
                placeholder="Seleccionar grupo"
                disabled={loading || gruposFiltrados.length === 0}
                fullWidth
              />
            </div>
          </div>

          {/* Filtros Avanzados */}
          {showAdvanced && (
            <div className="border-t border-gray-200 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <CalendarIcon className="h-4 w-4 inline mr-1" />
                    Fecha Inicio
                  </label>
                  <Input
                    type="date"
                    value={filters.fecha_inicio || ''}
                    onChange={(e) => updateFilter('fecha_inicio', e.target.value)}
                    disabled={loading}
                    fullWidth
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <CalendarIcon className="h-4 w-4 inline mr-1" />
                    Fecha Fin
                  </label>
                  <Input
                    type="date"
                    value={filters.fecha_fin || ''}
                    onChange={(e) => updateFilter('fecha_fin', e.target.value)}
                    disabled={loading}
                    fullWidth
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Periodo
                  </label>
                  <Select
                    options={[{ value: '', label: 'Todos los periodos' }, ...periodoOptions]}
                    value={filters.periodo || ''}
                    onChange={(value) => updateFilter('periodo', value)}
                    placeholder="Seleccionar periodo"
                    disabled={loading}
                    fullWidth
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Asistencia Mínima (%)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={filters.porcentaje_minimo?.toString() || ''}
                    onChange={(e) => updateFilter('porcentaje_minimo', e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Ej: 75"
                    disabled={loading}
                    fullWidth
                  />
                </div>
              </div>
            </div>
          )}

          {/* Filtros Activos */}
          {hasActiveFilters && (
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center space-x-2 flex-wrap gap-2">
                <span className="text-sm font-medium text-gray-700">Filtros activos:</span>
                
                {filters.parroquia && (
                  <Badge 
                    variant="primary" 
                    size="sm"
                    onRemove={() => updateFilter('parroquia', undefined)}
                  >
                    Parroquia: {parroquias.find(p => p.id_parroquia === filters.parroquia)?.nombre}
                  </Badge>
                )}
                
                {filters.nivel && (
                  <Badge 
                    variant="primary" 
                    size="sm"
                    onRemove={() => updateFilter('nivel', undefined)}
                  >
                    Nivel: {niveles.find(n => n.id_nivel === filters.nivel)?.nombre}
                  </Badge>
                )}
                
                {filters.grupo && (
                  <Badge 
                    variant="primary" 
                    size="sm"
                    onRemove={() => updateFilter('grupo', undefined)}
                  >
                    Grupo: {grupos.find(g => g.id_grupo === filters.grupo)?.nombre}
                  </Badge>
                )}
                
                {filters.fecha_inicio && (
                  <Badge 
                    variant="primary" 
                    size="sm"
                    onRemove={() => updateFilter('fecha_inicio', undefined)}
                  >
                    Desde: {new Date(filters.fecha_inicio).toLocaleDateString()}
                  </Badge>
                )}
                
                {filters.fecha_fin && (
                  <Badge 
                    variant="primary" 
                    size="sm"
                    onRemove={() => updateFilter('fecha_fin', undefined)}
                  >
                    Hasta: {new Date(filters.fecha_fin).toLocaleDateString()}
                  </Badge>
                )}
                
                {filters.periodo && (
                  <Badge 
                    variant="primary" 
                    size="sm"
                    onRemove={() => updateFilter('periodo', undefined)}
                  >
                    Periodo: {filters.periodo}
                  </Badge>
                )}
                
                {filters.porcentaje_minimo && (
                  <Badge 
                    variant="primary" 
                    size="sm"
                    onRemove={() => updateFilter('porcentaje_minimo', undefined)}
                  >
                    Min. Asistencia: {filters.porcentaje_minimo}%
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Información de ayuda */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FunnelIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-900">
                  Consejos para filtrar asistencia:
                </h3>
                <div className="mt-1 text-sm text-blue-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Selecciona una parroquia para ver solo sus grupos</li>
                    <li>Usa el rango de fechas para analizar períodos específicos</li>
                    <li>El porcentaje mínimo ayuda a identificar estudiantes con baja asistencia</li>
                    <li>Los filtros se aplican automáticamente al cambiar</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AsistenciaFilters;