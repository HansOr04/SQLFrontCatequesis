// src/components/catequizandos/CatequizandoFilters.tsx - Corrección final
'use client';

import React, { useState, useEffect } from 'react';
import { 
  FunnelIcon, 
  XMarkIcon,
  AdjustmentsHorizontalIcon 
} from '@heroicons/react/24/outline';
import { Button } from '@/components/common/Button';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import SearchInput from '@/components/common/SearchInput';
import { Card, CardContent } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Parroquia } from '@/types/parroquia';
import { Nivel } from '@/types/nivel';
import { CatequizandoFilters as FilterType } from '@/types/catequizando';
import { parroquiasService } from '../../services/parroquias';
import { nivelesService } from '../../services/niveles';

interface CatequizandoFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
  onSearch: (query: string) => void;
  loading?: boolean;
}

export const CatequizandoFilters: React.FC<CatequizandoFiltersProps> = ({
  filters,
  onFiltersChange,
  onSearch,
  loading = false
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [parroquias, setParroquias] = useState<Parroquia[]>([]);
  const [niveles, setNiveles] = useState<Nivel[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Cargar datos de parroquias y niveles
  useEffect(() => {
    const loadData = async () => {
      setLoadingData(true);
      try {
        const [parroquiasResponse, nivelesResponse] = await Promise.all([
          parroquiasService.getAll(),
          nivelesService.getOrdenados()
        ]);

        if (parroquiasResponse.success) {
          setParroquias(parroquiasResponse.data);
        }

        if (nivelesResponse.success) {
          setNiveles(nivelesResponse.data);
        }
      } catch (error) {
        console.error('Error al cargar datos para filtros:', error);
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, []);

  const handleFilterChange = (key: keyof FilterType, value: any) => {
    const newFilters = { ...filters, [key]: value };
    onFiltersChange(newFilters);
  };

  // Función corregida para manejar el SearchInput
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    handleFilterChange('search', query);
    onSearch(query);
  };

  // Función corregida para manejar los Select
  const handleSelectChange = (key: keyof FilterType) => {
    return (value: string | number) => {
      const processedValue = typeof value === 'string' && value === '' 
        ? undefined 
        : typeof value === 'string' ? parseInt(value) : value;
      handleFilterChange(key, processedValue);
    };
  };

  const handleClearFilters = () => {
    const clearedFilters: FilterType = {
      search: '',
      parroquia: undefined,
      nivel: undefined,
      edad_min: undefined,
      edad_max: undefined,
      caso_especial: undefined,
    };
    onFiltersChange(clearedFilters);
    onSearch('');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.nivel) count++;
    if (filters.parroquia) count++;
    if (filters.edad_min) count++;
    if (filters.edad_max) count++;
    if (filters.caso_especial !== undefined) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  const parroquiaOptions = [
    { value: '', label: 'Todas las Parroquias' },
    ...parroquias.map(p => ({ value: p.id_parroquia.toString(), label: p.nombre }))
  ];

  const nivelOptions = [
    { value: '', label: 'Todos los Niveles' },
    ...niveles.map(n => ({ value: n.id_nivel.toString(), label: n.nombre }))
  ];

  const casoEspecialOptions = [
    { value: '', label: 'Todos' },
    { value: 'true', label: 'Solo casos especiales' },
    { value: 'false', label: 'Sin casos especiales' }
  ];

  return (
    <div className="space-y-4">
      {/* Búsqueda principal y filtros básicos */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Barra de búsqueda - CORREGIDA: removida prop 'loading' */}
        <div className="flex-1">
          <SearchInput
            placeholder="Buscar por nombre o documento"
            value={filters.search || ''}
            onChange={handleSearchChange}
          />
        </div>

        {/* Filtros rápidos */}
        <div className="flex gap-2">
          {/* Filtro por parroquia */}
          <Select
            value={filters.parroquia?.toString() || ''}
            onChange={handleSelectChange('parroquia')}
            options={parroquiaOptions}
            className="min-w-[180px]"
            disabled={loadingData}
          />

          {/* Botón filtros avanzados */}
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            icon={<AdjustmentsHorizontalIcon className="h-4 w-4" />}
            className="relative"
          >
            Filtros
            {activeFiltersCount > 0 && (
              <Badge 
                variant="primary" 
                size="sm"
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Filtros avanzados */}
      {showAdvanced && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Filtro por nivel */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nivel
                </label>
                <Select
                  value={filters.nivel?.toString() || ''}
                  onChange={handleSelectChange('nivel')}
                  options={nivelOptions}
                  disabled={loadingData}
                />
              </div>

              {/* Filtro por caso especial */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Casos Especiales
                </label>
                <Select
                  value={filters.caso_especial?.toString() || ''}
                  onChange={(value: string | number) => {
                    const stringValue = value.toString();
                    const processedValue = stringValue === '' 
                      ? undefined 
                      : stringValue === 'true';
                    handleFilterChange('caso_especial', processedValue);
                  }}
                  options={casoEspecialOptions}
                />
              </div>

              {/* Edad mínima */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Edad Mínima
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Ej: 6"
                  value={filters.edad_min?.toString() || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleFilterChange('edad_min', e.target.value ? parseInt(e.target.value) : undefined)
                  }
                />
              </div>

              {/* Edad máxima */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Edad Máxima
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Ej: 18"
                  value={filters.edad_max?.toString() || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleFilterChange('edad_max', e.target.value ? parseInt(e.target.value) : undefined)
                  }
                />
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <FunnelIcon className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {activeFiltersCount > 0 
                    ? `${activeFiltersCount} filtro${activeFiltersCount > 1 ? 's' : ''} activo${activeFiltersCount > 1 ? 's' : ''}`
                    : 'Sin filtros aplicados'
                  }
                </span>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                  disabled={activeFiltersCount === 0}
                  icon={<XMarkIcon className="h-4 w-4" />}
                >
                  Limpiar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdvanced(false)}
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtros activos como badges */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <div 
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 cursor-pointer hover:bg-gray-200"
              onClick={() => handleFilterChange('search', '')}
            >
              Búsqueda: "{filters.search}"
              <XMarkIcon className="h-3 w-3 ml-1" />
            </div>
          )}
          
          {filters.parroquia && (
            <div 
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 cursor-pointer hover:bg-gray-200"
              onClick={() => handleFilterChange('parroquia', undefined)}
            >
              Parroquia: {parroquias.find(p => p.id_parroquia === filters.parroquia)?.nombre}
              <XMarkIcon className="h-3 w-3 ml-1" />
            </div>
          )}
          
          {filters.nivel && (
            <div 
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 cursor-pointer hover:bg-gray-200"
              onClick={() => handleFilterChange('nivel', undefined)}
            >
              Nivel: {niveles.find(n => n.id_nivel === filters.nivel)?.nombre}
              <XMarkIcon className="h-3 w-3 ml-1" />
            </div>
          )}
          
          {filters.caso_especial !== undefined && (
            <div 
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 cursor-pointer hover:bg-gray-200"
              onClick={() => handleFilterChange('caso_especial', undefined)}
            >
              {filters.caso_especial ? 'Solo casos especiales' : 'Sin casos especiales'}
              <XMarkIcon className="h-3 w-3 ml-1" />
            </div>
          )}
          
          {(filters.edad_min || filters.edad_max) && (
            <div 
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 cursor-pointer hover:bg-gray-200"
              onClick={() => {
                handleFilterChange('edad_min', undefined);
                handleFilterChange('edad_max', undefined);
              }}
            >
              Edad: {filters.edad_min || 0} - {filters.edad_max || '∞'} años
              <XMarkIcon className="h-3 w-3 ml-1" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};