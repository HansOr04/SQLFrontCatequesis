// src/services/inscripciones.ts
import { apiService } from './api';
import { ApiResponse, PaginationParams } from '@/types/api';
import { Inscripcion, InscripcionFormData, InscripcionFilters } from '@/types/inscripcion';

class InscripcionesService {
  private readonly baseUrl = '/inscripciones';

  // Obtener todas las inscripciones con filtros y paginación
  async getAll(params: InscripcionFilters & PaginationParams = {}): Promise<ApiResponse<Inscripcion[]>> {
    return apiService.get(this.baseUrl, params);
  }

  // Obtener inscripción por ID
  async getById(id: number): Promise<ApiResponse<Inscripcion>> {
    return apiService.get(`${this.baseUrl}/${id}`);
  }

  // Obtener inscripciones por catequizando
  async getByCatequizando(idCatequizando: number): Promise<ApiResponse<Inscripcion[]>> {
    return apiService.get(`${this.baseUrl}/catequizando/${idCatequizando}`);
  }

  // Obtener inscripciones por grupo
  async getByGrupo(idGrupo: number): Promise<ApiResponse<Inscripcion[]>> {
    return apiService.get(`${this.baseUrl}/grupo/${idGrupo}`);
  }

  // Buscar inscripciones
  async search(params: {
    q: string;
    grupo?: number;
    periodo?: string;
    pago?: 'true' | 'false';
  }): Promise<ApiResponse<Inscripcion[]>> {
    return apiService.get(`${this.baseUrl}/search`, params);
  }

  // Obtener estadísticas de inscripciones
  async getStats(): Promise<ApiResponse<{
    total_inscripciones: number;
    inscripciones_activas: number;
    inscripciones_pendientes_pago: number;
    inscripciones_completadas: number;
    por_parroquia: Array<{ parroquia: string; total: number }>;
    por_nivel: Array<{ nivel: string; total: number }>;
  }>> {
    return apiService.get(`${this.baseUrl}/stats`);
  }

  // Obtener inscripciones pendientes de pago
  async getPendientesPago(): Promise<ApiResponse<Inscripcion[]>> {
    return apiService.get(`${this.baseUrl}/pendientes-pago`);
  }

  // Crear nueva inscripción
  async create(data: InscripcionFormData): Promise<ApiResponse<Inscripcion>> {
    return apiService.post(this.baseUrl, data);
  }

  // Inscribir catequizando con validaciones completas
  async inscribir(data: {
    id_catequizando: number;
    id_grupo: number;
    validar_requisitos?: boolean;
    observaciones?: string;
  }): Promise<ApiResponse<Inscripcion>> {
    return apiService.post(`${this.baseUrl}/inscribir`, data);
  }

  // Actualizar inscripción
  async update(id: number, data: InscripcionFormData): Promise<ApiResponse<Inscripcion>> {
    return apiService.put(`${this.baseUrl}/${id}`, data);
  }

  // Actualizar estado de pago
  async updatePago(id: number, pagoRealizado: boolean): Promise<ApiResponse<Inscripcion>> {
    return apiService.put(`${this.baseUrl}/${id}/pago`, { pago_realizado: pagoRealizado });
  }

  // Eliminar inscripción
  async delete(id: number): Promise<ApiResponse<void>> {
    return apiService.delete(`${this.baseUrl}/${id}`);
  }

  // Validar elegibilidad para inscripción
  async validarElegibilidad(idCatequizando: number, idNivel: number): Promise<ApiResponse<{
    elegible: boolean;
    razones: string[];
    requisitos_faltantes: string[];
    edad_apropiada: boolean;
    nivel_sugerido?: string;
  }>> {
    return apiService.post(`/catequizandos/${idCatequizando}/validar-inscripcion`, {
      id_nivel: idNivel
    });
  }

  // Obtener inscripciones activas por parroquia
  async getActivasByParroquia(idParroquia: number): Promise<ApiResponse<Inscripcion[]>> {
    return apiService.get(this.baseUrl, { parroquia: idParroquia, activas: true });
  }

  // Generar reporte de inscripciones
  async generarReporte(params: {
    parroquia?: number;
    grupo?: number;
    periodo?: string;
    formato?: 'json' | 'csv' | 'excel';
  } = {}): Promise<ApiResponse<any>> {
    return apiService.get(`${this.baseUrl}/reporte`, params);
  }

  // Procesar pago masivo
  async procesarPagoMasivo(inscripciones: number[]): Promise<ApiResponse<{
    procesadas: number;
    errores: string[];
  }>> {
    return apiService.post(`${this.baseUrl}/pago-masivo`, { inscripciones });
  }

  // Transferir inscripción a otro grupo
  async transferir(idInscripcion: number, nuevoGrupoId: number, motivo?: string): Promise<ApiResponse<Inscripcion>> {
    return apiService.post(`${this.baseUrl}/${idInscripcion}/transferir`, {
      nuevo_grupo_id: nuevoGrupoId,
      motivo
    });
  }

  // Completar inscripción (marcar como terminada)
  async completar(idInscripcion: number, observaciones?: string): Promise<ApiResponse<Inscripcion>> {
    return apiService.post(`${this.baseUrl}/${idInscripcion}/completar`, { observaciones });
  }

  // Obtener historial de cambios de una inscripción
  async getHistorial(idInscripcion: number): Promise<ApiResponse<Array<{
    fecha: string;
    accion: string;
    usuario: string;
    detalles: string;
  }>>> {
    return apiService.get(`${this.baseUrl}/${idInscripcion}/historial`);
  }
}

export const inscripcionesService = new InscripcionesService();
export default inscripcionesService;