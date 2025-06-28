// src/components/grupos/GrupoForm.tsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  UserGroupIcon, 
  HomeIcon, 
  AcademicCapIcon,
  CalendarIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import Input  from '@/components/common/Input';
import Select from '@/components/common/Select';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { GrupoFormData, Grupo } from '@/types/grupo';
import { Parroquia } from '@/types/parroquia';
import { Nivel } from '@/types/nivel';
import { useApi } from '@/hooks/useApi';
import { parroquiasService } from '@/services/parroquias';
import { nivelesService } from '@/services/niveles';

interface GrupoFormProps {
  grupo?: Grupo;
  onSubmit: (data: GrupoFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const GrupoForm: React.FC<GrupoFormProps> = ({
  grupo,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [parroquias, setParroquias] = useState<Parroquia[]>([]);
  const [niveles, setNiveles] = useState<Nivel[]>([]);
  
  const { loading: loadingData } = useApi();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<GrupoFormData>({
    defaultValues: grupo ? {
      id_parroquia: grupo.id_parroquia,
      id_nivel: grupo.id_nivel,
      nombre: grupo.nombre,
      periodo: grupo.periodo,
    } : {
      periodo: new Date().getFullYear().toString(),
    },
    mode: 'onChange',
  });

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [parroquiasRes, nivelesRes] = await Promise.all([
          parroquiasService.getAll(),
          nivelesService.getOrdenados(),
        ]);

        if (parroquiasRes.success) {
          setParroquias(parroquiasRes.data);
        }

        if (nivelesRes.success) {
          setNiveles(nivelesRes.data);
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };

    loadInitialData();
  }, []);

  const watchedParroquia = watch('id_parroquia');
  const watchedNivel = watch('id_nivel');

  const handleFormSubmit = async (data: GrupoFormData) => {
    await onSubmit(data);
  };

  const generateGroupName = () => {
    const nivel = niveles.find(n => n.id_nivel === Number(watchedNivel));
    const parroquia = parroquias.find(p => p.id_parroquia === Number(watchedParroquia));
    
    if (nivel && parroquia) {
      // Contar grupos existentes del mismo nivel (esto se haría con una llamada al backend)
      const letra = String.fromCharCode(65); // A, B, C, etc.
      const nombre = `Grupo ${letra} - ${nivel.nombre}`;
      setValue('nombre', nombre);
    }
  };

  const currentYear = new Date().getFullYear();
  const periodoOptions = [
    { value: currentYear.toString(), label: currentYear.toString() },
    { value: `${currentYear}-${currentYear + 1}`, label: `${currentYear}-${currentYear + 1}` },
    { value: (currentYear + 1).toString(), label: (currentYear + 1).toString() },
  ];

  const parroquiaOptions = parroquias.map(p => ({
    value: p.id_parroquia.toString(),
    label: p.nombre,
  }));

  const nivelOptions = niveles.map(n => ({
    value: n.id_nivel.toString(),
    label: n.nombre,
    description: n.descripcion,
  }));

  if (loadingData) {
    return (
      <Card>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="lg" text="Cargando formulario..." />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <UserGroupIcon className="h-6 w-6 text-primary-600" />
          <span>{grupo ? 'Editar Grupo' : 'Nuevo Grupo'}</span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Información Básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Parroquia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <HomeIcon className="h-4 w-4 inline mr-1" />
                Parroquia
              </label>
              <Select
                options={parroquiaOptions}
                placeholder="Seleccione una parroquia"
                value={watch('id_parroquia')?.toString()}
                onChange={(value) => setValue('id_parroquia', Number(value))}
                error={errors.id_parroquia?.message}
                required
                fullWidth
              />
            </div>

            {/* Nivel */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <AcademicCapIcon className="h-4 w-4 inline mr-1" />
                Nivel
              </label>
              <Select
                options={nivelOptions}
                placeholder="Seleccione un nivel"
                value={watch('id_nivel')?.toString()}
                onChange={(value) => setValue('id_nivel', Number(value))}
                error={errors.id_nivel?.message}
                required
                fullWidth
              />
            </div>
          </div>

          {/* Nombre del Grupo */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                <UserGroupIcon className="h-4 w-4 inline mr-1" />
                Nombre del Grupo
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={generateGroupName}
                disabled={!watchedParroquia || !watchedNivel}
                className="text-xs"
              >
                Generar Automático
              </Button>
            </div>
            <Input
              {...register('nombre', {
                required: 'El nombre es requerido',
                minLength: {
                  value: 2,
                  message: 'El nombre debe tener al menos 2 caracteres',
                },
              })}
              placeholder="Ej: Grupo A - Iniciación"
              error={errors.nombre?.message}
              fullWidth
            />
          </div>

          {/* Periodo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CalendarIcon className="h-4 w-4 inline mr-1" />
              Periodo
            </label>
            <Select
              options={periodoOptions}
              placeholder="Seleccione el periodo"
              value={watch('periodo')}
              onChange={(value) => setValue('periodo', value as string)}
              error={errors.periodo?.message}
              required
              fullWidth
            />
          </div>

          {/* Vista Previa */}
          {watchedParroquia && watchedNivel && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Vista Previa del Grupo</h4>
              <div className="space-y-1 text-sm text-blue-800">
                <div>
                  <strong>Parroquia:</strong> {parroquias.find(p => p.id_parroquia === Number(watchedParroquia))?.nombre}
                </div>
                <div>
                  <strong>Nivel:</strong> {niveles.find(n => n.id_nivel === Number(watchedNivel))?.nombre}
                </div>
                <div>
                  <strong>Nombre:</strong> {watch('nombre') || 'Sin definir'}
                </div>
                <div>
                  <strong>Periodo:</strong> {watch('periodo')}
                </div>
              </div>
            </div>
          )}

          {/* Acciones */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={loading}
              icon={<XMarkIcon className="h-4 w-4" />}
            >
              Cancelar
            </Button>
            
            <Button
              type="submit"
              variant="primary"
              disabled={!isValid || loading}
              loading={loading}
              icon={<CheckIcon className="h-4 w-4" />}
            >
              {grupo ? 'Actualizar Grupo' : 'Crear Grupo'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default GrupoForm;