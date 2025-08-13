import React, { createContext, useContext, ReactNode } from 'react';
import { PayInvoiceInvoiceRepository } from './payInvoice.invoice.repository';

interface PayInvoiceInvoiceProviderProps {
  children: ReactNode;
  invoiceRepository: PayInvoiceInvoiceRepository;
}

const PayInvoiceInvoiceContext = createContext<PayInvoiceInvoiceRepository | null>(null);

export const PayInvoiceInvoiceProvider: React.FC<PayInvoiceInvoiceProviderProps> = ({
  children,
  invoiceRepository,
}) => {
  return (
    <PayInvoiceInvoiceContext.Provider value={invoiceRepository}>
      {children}
    </PayInvoiceInvoiceContext.Provider>
  );
};

export const usePayInvoiceInvoiceRepository = (): PayInvoiceInvoiceRepository => {
  const context = useContext(PayInvoiceInvoiceContext);
  if (!context) {
    throw new Error('usePayInvoiceInvoiceRepository must be used within a PayInvoiceInvoiceProvider');
  }
  return context;
};