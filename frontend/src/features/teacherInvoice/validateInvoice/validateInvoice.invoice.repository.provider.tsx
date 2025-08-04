import React, { createContext, useContext, ReactNode } from 'react';
import { ValidateInvoiceRepository } from './validateInvoice.invoice.repository';

interface ValidateInvoiceRepositoryContextType {
  validateInvoiceRepository: ValidateInvoiceRepository;
}

const ValidateInvoiceRepositoryContext = createContext<ValidateInvoiceRepositoryContextType | undefined>(undefined);

interface ValidateInvoiceRepositoryProviderProps {
  validateInvoiceRepository: ValidateInvoiceRepository;
  children: ReactNode;
}

export const ValidateInvoiceRepositoryProvider: React.FC<ValidateInvoiceRepositoryProviderProps> = ({
  validateInvoiceRepository,
  children
}) => {
  return (
    <ValidateInvoiceRepositoryContext.Provider value={{ validateInvoiceRepository }}>
      {children}
    </ValidateInvoiceRepositoryContext.Provider>
  );
};

export const useValidateInvoiceRepository = (): ValidateInvoiceRepository => {
  const context = useContext(ValidateInvoiceRepositoryContext);
  if (!context) {
    throw new Error('useValidateInvoiceRepository must be used within a ValidateInvoiceRepositoryProvider');
  }
  return context.validateInvoiceRepository;
};