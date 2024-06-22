import {useState, useEffect} from 'react';

import api from '../services/api';

type ApiHook<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

const useApiRequest = <T>(endpoint: string, params: object): ApiHook<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetData = async () => {
      try {
        const response = await api.get<T>(endpoint, {params});
        setData(response?.data);
      } catch (err) {
        setError(err?.message);
      } finally {
        setLoading(false);
      }
    };

    fetData();
  }, [endpoint, params]);
  return {data, loading, error};
};

export default useApiRequest;
