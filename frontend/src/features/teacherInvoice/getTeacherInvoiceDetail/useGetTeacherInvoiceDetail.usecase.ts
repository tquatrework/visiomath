import { useState } from 'react';
import { useGetTeacherInvoiceDetailRepository } from './getTeacherInvoiceDetail.teacherInvoice.repository.provider';
import { GetTeacherInvoiceDetailQueryResult } from './getTeacherInvoiceDetail.queryResult';

export const useGetTeacherInvoiceDetail = () => {
  const [invoiceDetail, setInvoiceDetail] = useState<GetTeacherInvoiceDetailQueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const repository = useGetTeacherInvoiceDetailRepository();

  const getInvoiceDetail = async (invoiceId: number) => {
    try {
      setLoading(true);
      setError(null);
      const result = await repository.getById(invoiceId);
      setInvoiceDetail(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return {
    invoiceDetail,
    loading,
    error,
    getInvoiceDetail
  };
};