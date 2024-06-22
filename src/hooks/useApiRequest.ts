import {useState, useEffect} from 'react';
import axios from 'axios';

type ApiHook<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

const useApiRequest = <T>(
  endpoint: string,
  params: {[key: string]: any},
): ApiHook<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`https://newsapi.org/v2${endpoint}`, {
          params,
        });

        setData(response.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, JSON.stringify(params)]); // Use JSON.stringify(params) to track changes

  return {data, loading, error};
};

export default useApiRequest;
