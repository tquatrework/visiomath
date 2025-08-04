import { useState } from 'react';
import { useValidateInvoiceRepository } from './validateInvoice.invoice.repository.provider';
import { ValidateInvoiceCommand } from './validateInvoice.command';

export const useValidateInvoice = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const validateInvoiceRepository = useValidateInvoiceRepository();

  const validateInvoice = async (invoiceId: number) => {
    try {
      setIsLoading(true);
      setError(null);
      setIsSuccess(false);
      
      const command: ValidateInvoiceCommand = { invoiceId };
      await validateInvoiceRepository.execute(command);
      
      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    validateInvoice,
    isLoading,
    error,
    isSuccess
  };
};