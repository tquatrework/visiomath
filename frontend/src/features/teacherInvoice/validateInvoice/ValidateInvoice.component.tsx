import React from 'react';
import { useValidateInvoice } from './useValidateInvoice.usecase';

interface ValidateInvoiceComponentProps {
  invoiceId: number;
}

export const ValidateInvoiceComponent: React.FC<ValidateInvoiceComponentProps> = ({ invoiceId }) => {
  const { validateInvoice, isLoading, error, isSuccess } = useValidateInvoice();

  const handleValidate = () => {
    validateInvoice(invoiceId);
  };


  return (

      <>
          {isSuccess && <div className="text-green-500">Facture validée</div>}

          {error && <div className="text-red-500">{error}</div>}

          <button
              data-testid="validate-invoice-button"
              onClick={handleValidate}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
              {isLoading ? 'Validation en cours...' : 'Valider la facture'}
          </button>
      </>
      


  );
};