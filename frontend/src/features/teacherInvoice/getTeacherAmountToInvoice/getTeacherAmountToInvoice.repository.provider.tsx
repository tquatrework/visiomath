import React, { createContext, ReactNode } from 'react';
import { GetTeacherAmountToInvoiceRepository } from './getTeacherAmountToInvoice.repository';

export const GetTeacherAmountToInvoiceRepositoryContext = createContext<GetTeacherAmountToInvoiceRepository>(
    {} as GetTeacherAmountToInvoiceRepository
);

type GetTeacherAmountToInvoiceProviderProps = {
    children: ReactNode;
    getTeacherAmountToInvoiceRepository: GetTeacherAmountToInvoiceRepository;
};

export const GetTeacherAmountToInvoiceProvider: React.FC<GetTeacherAmountToInvoiceProviderProps> = ({
    children,
    getTeacherAmountToInvoiceRepository,
}) => {
    return (
        <GetTeacherAmountToInvoiceRepositoryContext.Provider value={getTeacherAmountToInvoiceRepository}>
            {children}
        </GetTeacherAmountToInvoiceRepositoryContext.Provider>
    );
};
