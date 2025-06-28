// src/components/catequizandos/CatequizandoCard.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  CalendarIcon,
  HomeIcon,
  AcademicCapIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Card } from '@/components/common/Card';
import { Catequizando } from '@/types/catequizando';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/lib/constants';
import { formatDate, calculateAge } from '@/lib/utils';

interface CatequizandoCardProps {
  catequizando: Catequizando;
  onEdit?: (catequizando: Catequizando) => void;
  onDelete?: (catequizando: Catequizando) => void;
  showActions?: boolean;
  compact?: boolean;
}

export const CatequizandoCard: React.FC<CatequizandoCardProps> = ({
  catequizando,
  onEdit,
  onDelete,
  showActions = true,
  compact = false
}) => {
  const { user } = useAuth();
  
  const canEdit = user?.tipo_perfil && ['admin', 'parroco', 'secretaria'].includes(user.tipo_perfil);
  const canDelete = user?.tipo_perfil === 'admin';

  const edad = calculateAge(catequizando.fecha_nacimiento);
  
  // Determinar porcentaje de asistencia y color (con fallback a 0)
  // Usar edad calculada como fallback para mostrar algo
  const porcentajeAsistencia = catequizando.edad || edad || 0;
  const asistenciaColor = porcentajeAsistencia >= 80 ? 'success' : 
                         porcentajeAsistencia >= 60 ? 'warning' : 'error';

  const handleEdit = () => {
    if (onEdit) {
      onEdit(catequizando);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(catequizando);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <div className="relative p-6">
        {/* Header con foto y estado */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            {/* Avatar circular */}
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center overflow-hidden">
                <span className="text-blue-600 font-semibold text-lg">
                  {catequizando.nombres.charAt(0)}{catequizando.apellidos.charAt(0)}
                </span>
              </div>
              {/* Indicador de estado - por defecto activo si no está definido */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white bg-green-400" />
            </div>
            
            {/* Información básica */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {catequizando.nombres} {catequizando.apellidos}
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                CI: {catequizando.documento_identidad}
              </p>
              <Badge 
                variant="success"
                size="sm"
              >
                Activo
              </Badge>
            </div>
          </div>

          {/* Edad como porcentaje temporal */}
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {edad}
            </div>
            <p className="text-xs text-gray-500">años</p>
          </div>
        </div>

        {/* Información adicional */}
        <div className="space-y-3 mb-4">
          {/* Fecha de nacimiento y edad */}
          <div className="flex items-center text-sm text-gray-600">
            <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
            <span>
              {formatDate(catequizando.fecha_nacimiento)} 
              <span className="ml-2 text-gray-500">({edad} años)</span>
            </span>
          </div>

          {/* Caso especial */}
          {catequizando.caso_especial && (
            <div className="flex items-center">
              <Badge variant="warning" size="sm">
                Caso Especial
              </Badge>
            </div>
          )}
        </div>

        {/* Acciones */}
        {showActions && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex space-x-2">
              {/* Ver perfil */}
              <Link href={`${ROUTES.CATEQUIZANDOS}/${catequizando.id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<EyeIcon className="h-4 w-4" />}
                >
                  Ver Perfil
                </Button>
              </Link>

              {/* Editar */}
              {canEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                  icon={<PencilIcon className="h-4 w-4" />}
                >
                  Editar
                </Button>
              )}
            </div>

            {/* Eliminar */}
            {canDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 hover:border-red-300"
                icon={<TrashIcon className="h-4 w-4" />}
              >
                Borrar
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};