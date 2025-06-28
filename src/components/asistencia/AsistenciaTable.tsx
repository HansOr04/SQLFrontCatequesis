// src/components/asistencia/AsistenciaTable.tsx - Corregido
import React, { useState } from 'react';
import { 
  CheckIcon, 
  XMarkIcon, 
  CalendarIcon,
  UserIcon,
  BookmarkIcon // Reemplaza SaveIcon
} from '@heroicons/react/24/outline';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import Toggle from '@/components/common/Toggle'; // Import default
import { Badge } from '@/components/common/Badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Inscripcion } from '@/types/inscripcion';

interface AsistenciaRegistro {
  id_inscripcion: number;
  inscripcion: Inscripcion;
  asistio: boolean;
  observaciones?: string;
}

interface AsistenciaTableProps {
  fecha: string;
  grupoNombre: string;
  inscripciones: Inscripcion[];
  asistenciaExistente?: AsistenciaRegistro[];
  onGuardar: (asistencias: AsistenciaRegistro[]) => Promise<void>;
  loading?: boolean;
  readonly?: boolean;
}

export const AsistenciaTable: React.FC<AsistenciaTableProps> = ({
  fecha,
  grupoNombre,
  inscripciones,
  asistenciaExistente = [],
  onGuardar,
  loading = false,
  readonly = false,
}) => {
  const [asistencias, setAsistencias] = useState<AsistenciaRegistro[]>(() => {
    return inscripciones.map(inscripcion => {
      const existente = asistenciaExistente.find(a => a.id_inscripcion === inscripcion.id_inscripcion);
      return {
        id_inscripcion: inscripcion.id_inscripcion,
        inscripcion,
        asistio: existente?.asistio ?? false,
        observaciones: existente?.observaciones || '',
      };
    });
  });

  const [saving, setSaving] = useState(false);

  const handleAsistenciaChange = (idInscripcion: number, asistio: boolean) => {
    setAsistencias(prev => 
      prev.map(a => 
        a.id_inscripcion === idInscripcion 
          ? { ...a, asistio }
          : a
      )
    );
  };

  const handleObservacionChange = (idInscripcion: number, observaciones: string) => {
    setAsistencias(prev => 
      prev.map(a => 
        a.id_inscripcion === idInscripcion 
          ? { ...a, observaciones }
          : a
      )
    );
  };

  const handleGuardarTodos = async () => {
    setSaving(true);
    try {
      await onGuardar(asistencias);
    } finally {
      setSaving(false);
    }
  };

  const marcarTodosPresentes = () => {
    setAsistencias(prev => prev.map(a => ({ ...a, asistio: true })));
  };

  const marcarTodosAusentes = () => {
    setAsistencias(prev => prev.map(a => ({ ...a, asistio: false })));
  };

  const totalPresentes = asistencias.filter(a => a.asistio).length;
  const totalAusentes = asistencias.length - totalPresentes;
  const porcentajeAsistencia = asistencias.length > 0 ? Math.round((totalPresentes / asistencias.length) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="lg" text="Cargando lista de asistencia..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con información del grupo y fecha */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-primary-600" />
                <span>Asistencia - {grupoNombre}</span>
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {new Date(fecha).toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{totalPresentes}</div>
                <div className="text-xs text-gray-500">Presentes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{totalAusentes}</div>
                <div className="text-xs text-gray-500">Ausentes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{porcentajeAsistencia}%</div>
                <div className="text-xs text-gray-500">Asistencia</div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Acciones rápidas */}
      {!readonly && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={marcarTodosPresentes}
                  icon={<CheckIcon className="h-4 w-4" />}
                >
                  Marcar Todos Presentes
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={marcarTodosAusentes}
                  icon={<XMarkIcon className="h-4 w-4" />}
                >
                  Marcar Todos Ausentes
                </Button>
              </div>
              
              <Button
                variant="primary"
                onClick={handleGuardarTodos}
                loading={saving}
                icon={<BookmarkIcon className="h-4 w-4" />}
              >
                Guardar Asistencia
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabla de asistencia */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    N°
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catequizando
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documento
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asistencia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Observaciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {asistencias.map((asistencia, index) => (
                  <tr key={asistencia.id_inscripcion} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-gray-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {asistencia.inscripcion.nombre_catequizando || asistencia.inscripcion.nombres_catequizando} {asistencia.inscripcion.apellidos_catequizando || asistencia.inscripcion.apellido_catequizando}
                          </div>
                          <div className="text-sm text-gray-500">
                            Inscrito: {new Date(asistencia.inscripcion.fecha_inscripcion).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {asistencia.inscripcion.documento_identidad}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {readonly ? (
                        <Badge 
                          variant={asistencia.asistio ? 'success' : 'error'}
                          size="sm"
                        >
                          {asistencia.asistio ? 'Presente' : 'Ausente'}
                        </Badge>
                      ) : (
                        <Toggle
                          checked={asistencia.asistio}
                          onChange={(checked: boolean) => handleAsistenciaChange(asistencia.id_inscripcion, checked)}
                          checkedLabel="Presente"
                          uncheckedLabel="Ausente"
                        />
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {readonly ? (
                        <span className="text-sm text-gray-600">
                          {asistencia.observaciones || '-'}
                        </span>
                      ) : (
                        <input
                          type="text"
                          value={asistencia.observaciones}
                          onChange={(e) => handleObservacionChange(asistencia.id_inscripcion, e.target.value)}
                          placeholder="Observaciones..."
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {asistencias.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No hay catequizandos inscritos en este grupo
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AsistenciaTable;