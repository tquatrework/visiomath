import { useState } from 'react';
import { useRefuseInvoiceRepository } from './refuseInvoice.invoice.repository.provider';
import { RefuseInvoiceCommand } from './refuseInvoice.command';

export const useRefuseInvoice = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    
    const refuseInvoiceRepository = useRefuseInvoiceRepository();

    const refuse = async (invoiceId: number, refusalReason: string) => {
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const command: RefuseInvoiceCommand = {
                invoiceId,
                refusalReason,
            };

            await refuseInvoiceRepository.refuse(command);
            setSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue lors du refus de la facture');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        refuse,
        isLoading,
        error,
        success,
    };
};