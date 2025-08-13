import { useState } from 'react';
import { usePayInvoiceInvoiceRepository } from './payInvoice.invoice.repository.provider';
import { PayInvoiceCommand } from './payInvoice.command';

export const usePayInvoice = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const invoiceRepository = usePayInvoiceInvoiceRepository();

  const payInvoice = async (invoiceId: number) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const command: PayInvoiceCommand = { invoiceId };
      await invoiceRepository.payInvoice(command);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du paiement de la facture');
    } finally {
      setLoading(false);
    }
  };

  return {
    payInvoice,
    loading,
    error,
    success
  };
};