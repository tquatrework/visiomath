import { useState, useEffect } from 'react';
import { useGetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceRepository } from './getTeacherInvoicesNumberForCurrentMonth.teacherInvoice.repository.provider';
import { GetTeacherInvoicesNumberForCurrentMonthQueryResult } from './getTeacherInvoicesNumberForCurrentMonth.queryResult';

export function useGetTeacherInvoicesNumberForCurrentMonth() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<GetTeacherInvoicesNumberForCurrentMonthQueryResult | null>(null);
  
  const repository = useGetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceRepository();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await repository.getTeacherInvoicesNumberForCurrentMonth();
        setData(result);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération du nombre de factures';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [repository]);

  return { loading, error, data };
}