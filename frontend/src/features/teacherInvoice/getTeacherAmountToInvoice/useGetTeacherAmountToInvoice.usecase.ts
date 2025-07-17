import { useState, useEffect, useContext } from 'react';
import { GetTeacherAmountToInvoiceQueryResult } from './getTeacherAmountToInvoice.queryResult';
import { GetTeacherAmountToInvoiceRepositoryContext } from './getTeacherAmountToInvoice.repository.provider';

export const useGetTeacherAmountToInvoiceUsecase = () => {
    const [amountToInvoice, setAmountToInvoice] = useState<GetTeacherAmountToInvoiceQueryResult | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const repository = useContext(GetTeacherAmountToInvoiceRepositoryContext);

    useEffect(() => {
        const fetchAmountToInvoice = async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await repository.execute();
                setAmountToInvoice(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Une erreur est survenue');
            } finally {
                setLoading(false);
            }
        };

        fetchAmountToInvoice();
    }, [repository]);

    return { amountToInvoice, loading, error };
};
