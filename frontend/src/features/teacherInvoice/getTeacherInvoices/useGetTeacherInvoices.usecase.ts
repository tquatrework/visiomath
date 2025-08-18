import { useState, useEffect, useContext } from 'react';
import { GetTeacherInvoicesRepositoryContext } from './getTeacherInvoices.repository.provider';
import { GetTeacherInvoicesQueryResult } from './getTeacherInvoices.queryResult';

export const useGetTeacherInvoices = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<GetTeacherInvoicesQueryResult | null>(null);
  
  const repository = useContext(GetTeacherInvoicesRepositoryContext);
  
  const loadTeacherInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await repository.getTeacherInvoices();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeacherInvoices();
  }, []);

  return {
    loading,
    error,
    data,
  };
};