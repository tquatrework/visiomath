import { useState, useEffect } from 'react';
import { useGetCurrentTeacherInvoicesRepository } from './getCurrentTeacherInvoices.teacherInvoice.repository.provider';
import { GetCurrentTeacherInvoicesQueryResult } from './getCurrentTeacherInvoices.queryResult';

export const useGetCurrentTeacherInvoices = () => {
    const [invoices, setInvoices] = useState<GetCurrentTeacherInvoicesQueryResult | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getCurrentTeacherInvoicesRepository = useGetCurrentTeacherInvoicesRepository();

    const getCurrentTeacherInvoices = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getCurrentTeacherInvoicesRepository.getCurrentTeacherInvoices();
            setInvoices(result);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCurrentTeacherInvoices();
    }, []);

    return {
        invoices,
        loading,
        error,
        getCurrentTeacherInvoices,
    };
};