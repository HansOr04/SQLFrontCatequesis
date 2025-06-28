import { useState, useCallback } from 'react';
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
        const errorMessage = response.message || 'Error desconocido';
        setError(errorMessage);
        setState('error');
        options.onError?.(errorMessage);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error de conexión';
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
    execute,
    reset,
  };
}
