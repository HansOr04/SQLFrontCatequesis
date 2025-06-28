// src/components/grupos/GrupoDetail.tsx
import React, { useState } from 'react';
import { 
  UserGroupIcon, 
  HomeIcon, 
  AcademicCapIcon, 
  CalendarIcon,
  ChartBarIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Table } from '@/components/common/Table';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import GrupoStats from './GrupoStats';
import { Grupo } from '@/types/grupo';
import { Inscripcion } from '@/types/inscripcion';
import { Usuario } from '@/types/usuario';
import { usePermissions } from '@/hooks/usePermissions';

interface GrupoDetailProps {
  grupo: Grupo;
  inscripciones?: Inscripcion[];
  catequistas?: Usuario[];
  loading?: boolean;
  onEdit?: (grupo: Grupo) => void;
  onInscripcionEdit?: (inscripcion: Inscripcion) => void;
}

type TabType = 'info' | 'inscripciones' | 'catequistas' | 'stats';

export const GrupoDetail: React.FC<GrupoDetailProps> = ({
  grupo,
  inscripciones = [],
  catequistas = [],
  loading = false,
  onEdit,
  onInscripcionEdit,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const { canManage } = usePermissions();

  const tabs = [
    { key: 'info', label: 'Información', icon: ClipboardDocumentListIcon },
    { key: 'inscripciones', label: 'Catequizandos', icon: UsersIcon, count: inscripciones.length },
    { key: 'catequistas', label: 'Catequistas', icon: UserGroupIcon, count: catequistas.length },
    { key: 'stats', label: 'Estadísticas', icon: ChartBarIcon },
  ];

  const inscripcionColumns = [
    {
      key: 'catequizando',
      title: 'Catequizando',
      render: (inscripcion: Inscripcion) => (
        <div>
          <div className="font-medium text-gray-900">
            {inscripcion.nombres_catequizando} {inscripcion.apellidos_catequizando}
          </div>
          <div className="text-sm text-gray-500">
            CI: {inscripcion.documento_identidad}
          </div>
        </div>
      ),
    },
    {
      key: 'fecha_inscripcion',
      title: 'Fecha Inscripción',
      render: (inscripcion: Inscripcion) => (
        <span className="text-sm text-gray-600">
          {new Date(inscripcion.fecha_inscripcion).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'pago',
      title: 'Pago',
      render: (inscripcion: Inscripcion) => (
        <Badge 
          variant={inscripcion.pago_realizado ? 'success' : 'warning'}
          size="sm"
        >
          {inscripcion.pago_realizado ? 'Pagado' : 'Pendiente'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      title: 'Acciones',
      render: (inscripcion: Inscripcion) => (
        <div className="flex items-center space-x-2">
          {canManage('INSCRIPCIONES') && onInscripcionEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onInscripcionEdit(inscripcion)}
            >
              Editar
            </Button>
          )}
        </div>
      ),
    },
  ];

  const catequisteColumns = [
    {
      key: 'usuario',
      title: 'Catequista',
      render: (catequista: Usuario) => (
        <div>
          <div className="font-medium text-gray-900">{catequista.username}</div>
          <div className="text-sm text-gray-500">{catequista.tipo_perfil}</div>
        </div>
      ),
    },
    {
      key: 'estado',
      title: 'Estado',
      render: (catequista: Usuario) => (
        <Badge 
          variant={catequista.activo ? 'success' : 'error'}
          size="sm"
        >
          {catequista.activo ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="lg" text="Cargando detalles del grupo..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{grupo.nombre}</h1>
          <div className="flex items-center space-x-2">
            <Badge variant="primary">{grupo.nombre_nivel}</Badge>
            <Badge variant="secondary">{grupo.periodo}</Badge>
          </div>
        </div>
        
        {canManage('GRUPOS') && onEdit && (
          <Button
            variant="primary"
            onClick={() => onEdit(grupo)}
            icon={<PencilIcon className="h-4 w-4" />}
          >
            Editar Grupo
          </Button>
        )}
      </div>

      {/* Información básica */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <HomeIcon className="h-8 w-8 text-primary-600 mr-4" />
            <div>
              <div className="text-sm font-medium text-gray-500">Parroquia</div>
              <div className="text-lg font-semibold text-gray-900">{grupo.nombre_parroquia}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <AcademicCapIcon className="h-8 w-8 text-green-600 mr-4" />
            <div>
              <div className="text-sm font-medium text-gray-500">Nivel</div>
              <div className="text-lg font-semibold text-gray-900">{grupo.nombre_nivel}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <CalendarIcon className="h-8 w-8 text-blue-600 mr-4" />
            <div>
              <div className="text-sm font-medium text-gray-500">Periodo</div>
              <div className="text-lg font-semibold text-gray-900">{grupo.periodo}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
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
                    flex items-center py-2 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab.key
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'info' && (
            <Card>
              <CardHeader>
                <CardTitle>Información del Grupo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Grupo
                    </label>
                    <p className="text-gray-900">{grupo.nombre}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total de Catequizandos
                    </label>
                    <p className="text-gray-900">{grupo.total_inscripciones || 0}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Orden del Nivel
                    </label>
                    <p className="text-gray-900">{grupo.orden_nivel}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <Badge variant="success">Activo</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'inscripciones' && (
            <Card>
              <CardHeader>
                <CardTitle>Catequizandos Inscritos</CardTitle>
              </CardHeader>
              <CardContent>
                {inscripciones.length > 0 ? (
                  <Table
                    columns={inscripcionColumns}
                    data={inscripciones}
                    keyExtractor={(inscripcion: Inscripcion) => inscripcion.id_inscripcion.toString()}
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No hay catequizandos inscritos en este grupo
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'catequistas' && (
            <Card>
              <CardHeader>
                <CardTitle>Catequistas Asignados</CardTitle>
              </CardHeader>
              <CardContent>
                {catequistas.length > 0 ? (
                  <Table
                    columns={catequisteColumns}
                    data={catequistas}
                    keyExtractor={(catequista: Usuario) => catequista.id_usuario.toString()}
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No hay catequistas asignados a este grupo
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'stats' && (
            <GrupoStats grupoId={grupo.id_grupo} />
          )}
        </div>
      </div>
    </div>
  );
};

export default GrupoDetail;