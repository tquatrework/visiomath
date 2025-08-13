import React from 'react';
import { usePayInvoice } from './usePayInvoice.usecase';

interface PayInvoiceComponentProps {
  invoiceId: number;
}

export const PayInvoiceComponent: React.FC<PayInvoiceComponentProps> = ({ invoiceId }) => {
  const { payInvoice, loading, error, success } = usePayInvoice();

  const handlePayInvoice = async () => {
    await payInvoice(invoiceId);
  };

  return (
    <>
      {success && (
        <div className="space-y-2">
          <div className="text-green-500" data-testid="payment-confirmation-message">Facture payée avec succès</div>
        </div>
      )}
      
      {error && (
        <div className="text-red-500" data-testid="payment-error-message">{error}</div>
      )}

      <button
        data-testid="pay-invoice-button"
        onClick={handlePayInvoice}
        disabled={loading}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Paiement en cours...' : 'Payer la facture'}
      </button>
    </>
  );
};