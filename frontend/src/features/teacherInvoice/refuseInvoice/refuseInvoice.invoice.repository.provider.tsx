import React, { createContext, useContext, ReactNode } from 'react';
import { RefuseInvoiceRepository } from './refuseInvoice.invoice.repository';

const RefuseInvoiceRepositoryContext = createContext<RefuseInvoiceRepository | null>(null);

interface RefuseInvoiceProviderProps {
    children: ReactNode;
    refuseInvoiceRepository: RefuseInvoiceRepository;
}

export const RefuseInvoiceProvider: React.FC<RefuseInvoiceProviderProps> = ({
    children,
    refuseInvoiceRepository,
}) => {
    return (
        <RefuseInvoiceRepositoryContext.Provider value={refuseInvoiceRepository}>
            {children}
        </RefuseInvoiceRepositoryContext.Provider>
    );
};

export const useRefuseInvoiceRepository = (): RefuseInvoiceRepository => {
    const context = useContext(RefuseInvoiceRepositoryContext);
    if (!context) {
        throw new Error('useRefuseInvoiceRepository must be used within a RefuseInvoiceProvider');
    }
    return context;
};