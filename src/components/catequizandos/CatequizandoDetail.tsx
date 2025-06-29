// src/components/catequizandos/CatequizandoDetail.tsx - Corregido
'use client';

import React, { useState } from 'react';
import { 
  PencilIcon, 
  CalendarIcon,
  HomeIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  UsersIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Table } from '@/components/common/Table';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Catequizando } from '@/types/catequizando';
import { useAuth } from '@/context/AuthContext';
import { formatDate, calculateAge } from '@/lib/utils';

interface CatequizandoDetailProps {
  catequizando: Catequizando;
  inscripciones?: any[];
  certificados?: any[];
  sacramentos?: any[];
  representantes?: any[];
  padrinos?: any[];
  bautismo?: any;
  loading?: boolean;
  onEdit?: () => void;
}

export const CatequizandoDetail: React.FC<CatequizandoDetailProps> = ({
  catequizando,
  inscripciones = [],
  certificados = [],
  sacramentos = [],
  representantes = [],
  padrinos = [],
  bautismo,
  loading = false,
  onEdit
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  
  const canEdit = user?.tipo_perfil && ['admin', 'parroco', 'secretaria'].includes(user.tipo_perfil);
  const edad = catequizando.edad || calculateAge(catequizando.fecha_nacimiento);

  const tabs = [
    { id: 'general', label: 'Información General', icon: DocumentTextIcon },
    { id: 'inscripciones', label: 'Historial de Inscripciones', icon: AcademicCapIcon },
    { id: 'certificados', label: 'Certificados', icon: DocumentTextIcon },
    { id: 'sacramentos', label: 'Sacramentos', icon: CheckCircleIcon },
    { id: 'familia', label: 'Familia y Padrinos', icon: UsersIcon },
  ];

  // Columnas para tabla de inscripciones - CORREGIDO: title en lugar de label
  const inscripcionesColumns = [
    {
      key: 'periodo',
      title: 'Período',
      render: (item: any) => <span className="font-medium">{item.periodo}</span>
    },
    {
      key: 'nivel',
      title: 'Nivel',
      render: (item: any) => <span>{item.nivel}</span>
    },
    {
      key: 'grupo',
      title: 'Grupo',
      render: (item: any) => <span>{item.grupo}</span>
    },
    {
      key: 'parroquia',
      title: 'Parroquia',
      render: (item: any) => <span className="text-sm">{item.parroquia}</span>
    },
    {
      key: 'estado',
      title: 'Estado',
      render: (item: any) => (
        <Badge 
          variant={
            item.estado === 'activa' ? 'success' : 
            item.estado === 'completada' ? 'primary' : 'secondary'
          }
          size="sm"
        >
          {item.estado === 'activa' ? 'Activa' : 
           item.estado === 'completada' ? 'Completada' : 'Abandonada'}
        </Badge>
      )
    },
    {
      key: 'asistencia',
      title: 'Asistencia',
      render: (item: any) => (
        <span className={`font-medium ${
          (item.asistencia_promedio ?? 0) >= 80 ? 'text-green-600' : 
          (item.asistencia_promedio ?? 0) >= 60 ? 'text-yellow-600' : 'text-red-600'
        }`}>
          {item.asistencia_promedio ?? 0}%
        </span>
      )
    }
  ];

  // Columnas para tabla de certificados - CORREGIDO: title en lugar de label
  const certificadosColumns = [
    {
      key: 'numero',
      title: 'N° Certificado',
      render: (item: any) => <span className="font-mono text-sm">{item.numero_certificado || 'N/A'}</span>
    },
    {
      key: 'nivel',
      title: 'Nivel',
      render: (item: any) => <span className="font-medium">{item.nivel}</span>
    },
    {
      key: 'fecha_emision',
      title: 'Fecha de Emisión',
      render: (item: any) => <span>{formatDate(item.fecha_emision)}</span>
    },
    {
      key: 'parroquia',
      title: 'Parroquia',
      render: (item: any) => <span className="text-sm">{item.parroquia}</span>
    },
    {
      key: 'estado',
      title: 'Estado',
      render: (item: any) => (
        <Badge 
          variant={
            item.estado === 'emitido' ? 'success' : 
            item.estado === 'pendiente' ? 'warning' : 'error'
          }
          size="sm"
        >
          {item.estado === 'emitido' ? 'Emitido' : 
           item.estado === 'pendiente' ? 'Pendiente' : 'Anulado'}
        </Badge>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con información principal */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center overflow-hidden">
                  <span className="text-blue-600 font-semibold text-2xl">
                    {catequizando.nombres.charAt(0)}{catequizando.apellidos.charAt(0)}
                  </span>
                </div>
                {/* Estado activo/inactivo basado en el dato real */}
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-3 border-white ${
                  catequizando.activo ? 'bg-green-400' : 'bg-red-400'
                }`} />
              </div>

              {/* Información básica */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {catequizando.nombres} {catequizando.apellidos}
                </h1>
                
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                    <span className="font-medium">CI:</span>
                    <span className="ml-1">{catequizando.documento_identidad}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span>{formatDate(catequizando.fecha_nacimiento)} ({edad} años)</span>
                  </div>

                  {catequizando.nombre_parroquia && (
                    <div className="flex items-center text-gray-600">
                      <HomeIcon className="h-4 w-4 mr-2" />
                      <span>{catequizando.nombre_parroquia}</span>
                    </div>
                  )}

                  {catequizando.nivel_actual && (
                    <div className="flex items-center text-gray-600">
                      <AcademicCapIcon className="h-4 w-4 mr-2" />
                      <span>Nivel actual: {catequizando.nivel_actual}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 mt-3">
                  <Badge variant={catequizando.activo ? "success" : "error"}>
                    {catequizando.activo ? 'Activo' : 'Inactivo'}
                  </Badge>
                  
                  {catequizando.caso_especial && (
                    <Badge variant="warning">
                      Caso Especial
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Estadísticas y acciones */}
            <div className="text-right space-y-4">
              {/* Edad como estadística principal */}
              <div>
                <div className="text-3xl font-bold text-blue-600">
                  {edad}
                </div>
                <p className="text-sm text-gray-500">Años de edad</p>
              </div>

              {/* Porcentaje de asistencia si existe */}
              {catequizando.porcentaje_asistencia !== undefined && (
                <div>
                  <div className={`text-2xl font-bold ${
                    catequizando.porcentaje_asistencia >= 80 ? 'text-green-600' : 
                    catequizando.porcentaje_asistencia >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {catequizando.porcentaje_asistencia}%
                  </div>
                  <p className="text-sm text-gray-500">Asistencia</p>
                </div>
              )}

              {/* Botón editar */}
              {canEdit && (
                <Button
                  onClick={onEdit}
                  icon={<PencilIcon className="h-4 w-4" />}
                >
                  Editar
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navegación por tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido de tabs */}
      <div className="space-y-6">
        {/* Tab: Información General */}
        {activeTab === 'general' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Información personal */}
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Nombres completos</dt>
                    <dd className="text-sm text-gray-900">{catequizando.nombres} {catequizando.apellidos}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Documento de identidad</dt>
                    <dd className="text-sm text-gray-900 font-mono">{catequizando.documento_identidad}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Fecha de nacimiento</dt>
                    <dd className="text-sm text-gray-900">{formatDate(catequizando.fecha_nacimiento)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Edad actual</dt>
                    <dd className="text-sm text-gray-900">{edad} años</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Estado</dt>
                    <dd>
                      <Badge variant={catequizando.activo ? "success" : "error"} size="sm">
                        {catequizando.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </dd>
                  </div>
                  {catequizando.nombre_parroquia && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Parroquia</dt>
                      <dd className="text-sm text-gray-900">{catequizando.nombre_parroquia}</dd>
                    </div>
                  )}
                  {catequizando.nivel_actual && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Nivel actual</dt>
                      <dd className="text-sm text-gray-900">{catequizando.nivel_actual}</dd>
                    </div>
                  )}
                  {catequizando.caso_especial && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Observaciones</dt>
                      <dd>
                        <Badge variant="warning" size="sm">
                          Caso Especial
                        </Badge>
                      </dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>

            {/* Estadísticas de participación */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ChartBarIcon className="h-5 w-5 mr-2" />
                  Estadísticas de Participación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Edad actual</span>
                    <span className="font-medium text-blue-600">
                      {edad} años
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total de inscripciones</span>
                    <span className="font-medium">{inscripciones.length}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Certificados obtenidos</span>
                    <span className="font-medium">{certificados.filter(c => c.estado === 'emitido').length}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sacramentos recibidos</span>
                    <span className="font-medium">{sacramentos.length}</span>
                  </div>

                  {catequizando.porcentaje_asistencia !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Porcentaje de asistencia</span>
                      <span className={`font-medium ${
                        catequizando.porcentaje_asistencia >= 80 ? 'text-green-600' : 
                        catequizando.porcentaje_asistencia >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {catequizando.porcentaje_asistencia}%
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab: Inscripciones */}
        {activeTab === 'inscripciones' && (
          <Card>
            <CardHeader>
              <CardTitle>Historial de Inscripciones</CardTitle>
              <p className="text-sm text-gray-600">
                Registro completo de todas las inscripciones del catequizando
              </p>
            </CardHeader>
            <CardContent>
              {inscripciones.length > 0 ? (
                <Table
                  columns={inscripcionesColumns}
                  data={inscripciones}
                  keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                />
              ) : (
                <div className="text-center py-8">
                  <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Sin inscripciones</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Este catequizando aún no tiene inscripciones registradas.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tab: Certificados */}
        {activeTab === 'certificados' && (
          <Card>
            <CardHeader>
              <CardTitle>Certificados</CardTitle>
              <p className="text-sm text-gray-600">
                Certificados emitidos y pendientes para este catequizando
              </p>
            </CardHeader>
            <CardContent>
              {certificados.length > 0 ? (
                <Table
                  columns={certificadosColumns}
                  data={certificados}
                  keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                />
              ) : (
                <div className="text-center py-8">
                  <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Sin certificados</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No hay certificados registrados para este catequizando.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tab: Sacramentos */}
        {activeTab === 'sacramentos' && (
          <Card>
            <CardHeader>
              <CardTitle>Sacramentos Recibidos</CardTitle>
            </CardHeader>
            <CardContent>
              {sacramentos.length > 0 ? (
                <div className="space-y-3">
                  {sacramentos.map((sacramento, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                        <div>
                          <p className="font-medium">{sacramento.nombre}</p>
                          <p className="text-sm text-gray-500">{formatDate(sacramento.fecha)}</p>
                          {sacramento.parroquia && (
                            <p className="text-sm text-gray-500">{sacramento.parroquia}</p>
                          )}
                        </div>
                      </div>
                      <Badge variant="success" size="sm">Recibido</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Sin sacramentos registrados</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No hay sacramentos registrados para este catequizando.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tab: Familia y Padrinos */}
        {activeTab === 'familia' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Representantes */}
            <Card>
              <CardHeader>
                <CardTitle>Representantes</CardTitle>
              </CardHeader>
              <CardContent>
                {representantes.length > 0 ? (
                  <div className="space-y-3">
                    {representantes.map((representante, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <p className="font-medium">{representante.nombres} {representante.apellidos}</p>
                        <p className="text-sm text-gray-500">{representante.relacion}</p>
                        {representante.telefono && (
                          <p className="text-sm text-gray-500">{representante.telefono}</p>
                        )}
                        {representante.email && (
                          <p className="text-sm text-gray-500">{representante.email}</p>
                        )}
                        {representante.es_principal && (
                          <Badge variant="primary" size="sm" className="mt-1">Principal</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Sin representantes registrados</p>
                )}
              </CardContent>
            </Card>

            {/* Padrinos */}
            <Card>
              <CardHeader>
                <CardTitle>Padrinos</CardTitle>
              </CardHeader>
              <CardContent>
                {padrinos.length > 0 ? (
                  <div className="space-y-3">
                    {padrinos.map((padrino, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <p className="font-medium">{padrino.nombres} {padrino.apellidos}</p>
                        <p className="text-sm text-gray-500">{padrino.tipo_padrino}</p>
                        {padrino.telefono && (
                          <p className="text-sm text-gray-500">{padrino.telefono}</p>
                        )}
                        {padrino.email && (
                          <p className="text-sm text-gray-500">{padrino.email}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Sin padrinos registrados</p>
                )}
              </CardContent>
            </Card>

            {/* Datos de bautismo si existen */}
            {bautismo && (
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Datos de Bautismo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Fecha de bautismo</dt>
                      <dd className="text-sm text-gray-900">{formatDate(bautismo.fecha_bautismo)}</dd>
                    </div>
                    {bautismo.parroquia_bautismo && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Parroquia de bautismo</dt>
                        <dd className="text-sm text-gray-900">{bautismo.parroquia_bautismo}</dd>
                      </div>
                    )}
                    {bautismo.parroco_bautismo && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Párroco</dt>
                        <dd className="text-sm text-gray-900">{bautismo.parroco_bautismo}</dd>
                      </div>
                    )}
                    {bautismo.libro && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Libro</dt>
                        <dd className="text-sm text-gray-900">{bautismo.libro}</dd>
                      </div>
                    )}
                    {bautismo.folio && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Folio</dt>
                        <dd className="text-sm text-gray-900">{bautismo.folio}</dd>
                      </div>
                    )}
                    {bautismo.numero && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Número</dt>
                        <dd className="text-sm text-gray-900">{bautismo.numero}</dd>
                      </div>
                    )}
                    {bautismo.padrinos && (
                      <div className="md:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Padrinos de bautismo</dt>
                        <dd className="text-sm text-gray-900">{bautismo.padrinos}</dd>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};