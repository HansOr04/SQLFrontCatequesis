// src/hooks/useSidebarStats.ts - Corregido
import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { ApiResponse } from '@/types/api';

// ✅ Tipos para las respuestas de la API
interface CatequizandosStatsResponse {
  total_catequizandos: number;
  casos_especiales?: number;
  sin_inscripcion?: number;
}

interface UsuariosStatsResponse {
  total_usuarios: number;
  admins: number;
  parrocos: number;
  secretarias: number;
  catequistas: number;
  consultas: number;
}

interface GrupoResponse {
  id_grupo: number;
  nombre: string;
  id_parroquia: number;
  id_nivel: number;
  periodo: string;
}

interface SidebarStats {
  catequizandos: number;
  catequistas: number;
  grupos: number;
  certificados_pendientes: number;
  inscripciones_pendientes?: number;
}

interface UseSidebarStatsReturn {
  stats: SidebarStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useSidebarStats = (): UseSidebarStatsReturn => {
  const [stats, setStats] = useState<SidebarStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  const fetchStats = async () => {
    if (!isAuthenticated || !user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Realizar peticiones solo a los endpoints que SÍ EXISTEN
      const requests = await Promise.allSettled([
        // ✅ Estadísticas de catequizandos (EXISTE)
        apiService.get<CatequizandosStatsResponse>('/catequizandos/stats'),
        
        // ✅ Estadísticas de usuarios para obtener catequistas (EXISTE)
        user.tipo_perfil !== 'catequista' ? 
          apiService.get<UsuariosStatsResponse>('/usuarios/stats') : 
          Promise.resolve({ success: false, data: null }),
        
        // ✅ Obtener todos los grupos para contar (usar endpoint existente)
        apiService.get<GrupoResponse[]>('/grupos'),
        
        // ❌ Certificados: No hay endpoint, usar datos mock por ahora
        Promise.resolve({ success: true, data: { certificados_pendientes: 0 } }),
      ]);

      const [catequizandosRes, usuariosRes, gruposRes, certificadosRes] = requests;

      // Procesar resultados con tipado seguro
      const newStats: SidebarStats = {
        catequizandos: 0,
        catequistas: 0,
        grupos: 0,
        certificados_pendientes: 0,
      };

      // ✅ Catequizandos - usar endpoint existente
      if (catequizandosRes.status === 'fulfilled') {
        const response = catequizandosRes.value as ApiResponse<CatequizandosStatsResponse>;
        if (response?.success && response.data) {
          newStats.catequizandos = response.data.total_catequizandos || 0;
        }
      }

      // ✅ Grupos - contar desde el array de grupos
      if (gruposRes.status === 'fulfilled') {
        const response = gruposRes.value as ApiResponse<GrupoResponse[] | { data: GrupoResponse[] } | { total_grupos: number }>;
        
        if (response?.success && response.data) {
          const data = response.data;
          
          // Manejar diferentes formatos de respuesta
          if (Array.isArray(data)) {
            newStats.grupos = data.length;
          } else if (data && typeof data === 'object') {
            if ('data' in data && Array.isArray(data.data)) {
              newStats.grupos = data.data.length;
            } else if ('total_grupos' in data && typeof data.total_grupos === 'number') {
              newStats.grupos = data.total_grupos;
            }
          }
        }
      }

      // ✅ Catequistas - usar endpoint existente
      if (usuariosRes && usuariosRes.status === 'fulfilled') {
        const response = usuariosRes.value as ApiResponse<UsuariosStatsResponse> | { success: boolean; data: null };
        if ('data' in response && response.success && response.data) {
          newStats.catequistas = response.data.catequistas || 0;
        }
      }

      // ❌ Certificados - valor por defecto (no hay endpoint)
      if (certificadosRes.status === 'fulfilled') {
        newStats.certificados_pendientes = 0; // Valor por defecto
      }

      setStats(newStats);
    } catch (err) {
      console.error('Error fetching sidebar stats:', err);
      setError('Error al cargar estadísticas');
      
      // En caso de error, usar valores por defecto
      setStats({
        catequizandos: 0,
        catequistas: 0,
        grupos: 0,
        certificados_pendientes: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchStats();
  };

  useEffect(() => {
    fetchStats();
  }, [isAuthenticated, user?.id_usuario, user?.tipo_perfil]);

  return {
    stats,
    loading,
    error,
    refetch,
  };
};

// Hook especializado para obtener solo las estadísticas necesarias según el rol
export const useRoleBasedStats = () => {
  const { user } = useAuth();
  const { stats, loading, error, refetch } = useSidebarStats();

  // Filtrar estadísticas según el rol del usuario
  const getVisibleStats = () => {
    if (!stats || !user) return null;

    const visibleStats: Partial<SidebarStats> = {};

    // Todos pueden ver catequizandos y grupos
    visibleStats.catequizandos = stats.catequizandos;
    visibleStats.grupos = stats.grupos;

    // Solo roles específicos pueden ver catequistas
    if (['admin', 'parroco', 'secretaria'].includes(user.tipo_perfil)) {
      visibleStats.catequistas = stats.catequistas;
    }

    // Todos excepto consulta pueden ver certificados (cuando esté disponible)
    if (user.tipo_perfil !== 'consulta') {
      visibleStats.certificados_pendientes = stats.certificados_pendientes;
    }

    return visibleStats;
  };

  return {
    stats: getVisibleStats(),
    loading,
    error,
    refetch,
  };
};

// Hook simplificado que obtiene estadísticas básicas de endpoints existentes
export const useBasicSidebarStats = () => {
  const [stats, setStats] = useState({
    catequizandos: 0,
    grupos: 0,
    catequistas: 0,
  });
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchBasicStats = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Solo usar endpoints que sabemos que existen
        const [catequizandosRes, gruposRes] = await Promise.allSettled([
          apiService.get<CatequizandosStatsResponse>('/catequizandos/stats'),
          apiService.get<GrupoResponse[]>('/grupos')
        ]);

        const newStats = { catequizandos: 0, grupos: 0, catequistas: 0 };

        // Catequizandos
        if (catequizandosRes.status === 'fulfilled') {
          const response = catequizandosRes.value as ApiResponse<CatequizandosStatsResponse>;
          if (response?.success && response.data) {
            newStats.catequizandos = response.data.total_catequizandos || 0;
          }
        }

        // Grupos (contar del array)
        if (gruposRes.status === 'fulfilled') {
          const response = gruposRes.value as ApiResponse<GrupoResponse[]>;
          if (response?.success && response.data && Array.isArray(response.data)) {
            newStats.grupos = response.data.length;
          }
        }

        setStats(newStats);
      } catch (error) {
        console.error('Error fetching basic stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBasicStats();
  }, [isAuthenticated, user?.id_usuario]);

  return { stats, loading };
};

// Hook de respaldo que usa valores estáticos si las APIs fallan
export const useFallbackStats = () => {
  const { stats, loading, error } = useRoleBasedStats();
  
  // Si hay error o no hay datos, usar valores por defecto
  if (error || !stats) {
    return {
      stats: {
        catequizandos: 0,
        grupos: 0,
        catequistas: 0,
        certificados_pendientes: 0,
      },
      loading: false,
      error: null,
      refetch: () => {},
    };
  }
  
  return { stats, loading, error, refetch: () => {} };
};