import React, { useState, useCallback } from 'react';
import { ApiResponse, LoadingState } from '@/types/api';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export function useApi<T = any>(options: UseApiOptions = {}) {
  const [state, setState] = useState<LoadingState>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (apiCall: () => Promise<ApiResponse<T>>) => {
    setState('loading');
    setError(null);

    try {
      const response = await apiCall();
      
      if (response.success) {
        setData(response.data);
        setState('success');
        options.onSuccess?.(response.data);
      } else {
        const errorMessage = response.message || response.error || 'Error desconocido';
        setError(errorMessage);
        setState('error');
        options.onError?.(errorMessage);
      }
    } catch (err: any) {
      const errorMessage = err?.message || err?.response?.data?.message || 'Error de conexión';
      setError(errorMessage);
      setState('error');
      options.onError?.(errorMessage);
    }
  }, [options]);

  const reset = useCallback(() => {
    setState('idle');
    setData(null);
    setError(null);
  }, []);

  return {
    state,
    data,
    error,
    loading: state === 'loading',
    success: state === 'success',
    hasError: state === 'error',
    isIdle: state === 'idle',
    execute,
    reset,
  };
}

// Hook especializado para mutaciones (POST, PUT, DELETE)
export function useMutation<T = any>(options: UseApiOptions = {}) {
  const api = useApi<T>(options);

  const mutate = useCallback(
    async (apiCall: () => Promise<ApiResponse<T>>) => {
      return api.execute(apiCall);
    },
    [api]
  );

  return {
    ...api,
    mutate,
  };
}

// Hook para datos con auto-fetch
export function useQuery<T = any>(
  apiCall: (() => Promise<ApiResponse<T>>) | null,
  options: UseApiOptions & { 
    enabled?: boolean;
    refetchOnMount?: boolean;
  } = {}
) {
  const { enabled = true, refetchOnMount = true, ...apiOptions } = options;
  const api = useApi<T>(apiOptions);

  const refetch = useCallback(() => {
    if (apiCall && enabled) {
      return api.execute(apiCall);
    }
  }, [apiCall, enabled, api]);

  // Auto-fetch en mount si está habilitado
  React.useEffect(() => {
    if (refetchOnMount && apiCall && enabled) {
      refetch();
    }
  }, [refetch, refetchOnMount, apiCall, enabled]);

  return {
    ...api,
    refetch,
  };
}

// Hook para paginación
export function usePaginatedApi<T = any>(options: UseApiOptions = {}) {
  const api = useApi<T>(options);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const fetchPage = useCallback(
    async (apiCall: (page: number, limit: number) => Promise<ApiResponse<T>>) => {
      return api.execute(() => apiCall(page, limit));
    },
    [api, page, limit]
  );

  const nextPage = useCallback(() => setPage(p => p + 1), []);
  const prevPage = useCallback(() => setPage(p => Math.max(1, p - 1)), []);
  const goToPage = useCallback((newPage: number) => setPage(newPage), []);

  return {
    ...api,
    page,
    limit,
    setLimit,
    fetchPage,
    nextPage,
    prevPage,
    goToPage,
  };
}