// src/components/grupos/GrupoCard.tsx
import React from 'react';
import Link from 'next/link';
import { 
  UserGroupIcon, 
  CalendarIcon, 
  HomeIcon,
  AcademicCapIcon,
  ChartBarIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Grupo } from '@/types/grupo';
import { usePermissions } from '@/hooks/usePermissions';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface GrupoCardProps {
  grupo: Grupo;
  onEdit?: (grupo: Grupo) => void;
  onDelete?: (grupo: Grupo) => void;
  className?: string;
}

export const GrupoCard: React.FC<GrupoCardProps> = ({
  grupo,
  onEdit,
  onDelete,
  className,
}) => {
  const { canManage } = usePermissions();

  const getNivelColor = (orden?: number) => {
    if (!orden) return 'bg-gray-100 text-gray-800';
    
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800', 
      'bg-yellow-100 text-yellow-800',
      'bg-purple-100 text-purple-800',
      'bg-indigo-100 text-indigo-800',
      'bg-pink-100 text-pink-800',
    ];
    
    return colors[(orden - 1) % colors.length];
  };

  const getCapacidadColor = (total?: number) => {
    if (!total) return 'text-gray-500';
    if (total >= 25) return 'text-red-600';
    if (total >= 20) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <Card 
      className={cn('grupo-card hover:shadow-lg transition-all duration-200', className)} 
      hover
    >
      {/* Header del Card */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <UserGroupIcon className="h-5 w-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {grupo.nombre}
            </h3>
          </div>
          
          <div className="flex items-center space-x-1">
            <Badge 
              variant="primary" 
              size="sm"
              className={getNivelColor(grupo.orden_nivel)}
            >
              {grupo.nombre_nivel}
            </Badge>
            <Badge variant="secondary" size="sm">
              {grupo.periodo}
            </Badge>
          </div>
        </div>

        {canManage('GRUPOS') && (
          <div className="flex items-center space-x-1 ml-2">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(grupo)}
                icon={<PencilIcon className="h-4 w-4" />}
              >
                {/* Icon-only button */}
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(grupo)}
                icon={<TrashIcon className="h-4 w-4" />}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                {/* Icon-only button */}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Información Principal */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <HomeIcon className="h-4 w-4 mr-2" />
          <span className="truncate">{grupo.nombre_parroquia}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <CalendarIcon className="h-4 w-4 mr-2" />
          <span>Periodo {grupo.periodo}</span>
        </div>

        <div className="flex items-center text-sm">
          <AcademicCapIcon className="h-4 w-4 mr-2 text-gray-400" />
          <span className="text-gray-600 mr-1">Catequizandos:</span>
          <span className={cn('font-medium', getCapacidadColor(grupo.total_inscripciones))}>
            {grupo.total_inscripciones || 0}
          </span>
        </div>
      </div>

      {/* Estadísticas Rápidas */}
      {grupo.total_inscripciones && grupo.total_inscripciones > 0 && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Estado del Grupo</span>
            <div className="flex items-center space-x-2">
              <ChartBarIcon className="h-4 w-4 text-gray-400" />
              <span className="font-medium text-gray-900">
                {grupo.total_inscripciones} inscritos
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Acciones */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
        <Link href={ROUTES.GRUPOS_DETAIL(grupo.id_grupo)}>
          <Button
            variant="ghost"
            size="sm"
            icon={<EyeIcon className="h-4 w-4" />}
          >
            Ver Detalles
          </Button>
        </Link>

        <div className="flex items-center space-x-2">
          <Link href={`/asistencia/grupo/${grupo.id_grupo}`}>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
            >
              Asistencia
            </Button>
          </Link>
          
          {canManage('GRUPOS') && (
            <Link href={ROUTES.GRUPOS_EDIT(grupo.id_grupo)}>
              <Button
                variant="primary"
                size="sm"
                className="text-xs"
              >
                Gestionar
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
};

export default GrupoCard;