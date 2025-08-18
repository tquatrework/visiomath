import React, { createContext, useContext, ReactNode } from 'react';
import { GetCurrentTeacherInvoicesTeacherInvoiceRepository } from './getCurrentTeacherInvoices.teacherInvoice.repository';

const GetCurrentTeacherInvoicesContext = createContext<GetCurrentTeacherInvoicesTeacherInvoiceRepository | undefined>(undefined);

type GetCurrentTeacherInvoicesProviderProps = {
    getCurrentTeacherInvoicesRepository: GetCurrentTeacherInvoicesTeacherInvoiceRepository;
    children: ReactNode;
};

export const GetCurrentTeacherInvoicesProvider: React.FC<GetCurrentTeacherInvoicesProviderProps> = ({
    getCurrentTeacherInvoicesRepository,
    children,
}) => {
    return (
        <GetCurrentTeacherInvoicesContext.Provider value={getCurrentTeacherInvoicesRepository}>
            {children}
        </GetCurrentTeacherInvoicesContext.Provider>
    );
};

export const useGetCurrentTeacherInvoicesRepository = (): GetCurrentTeacherInvoicesTeacherInvoiceRepository => {
    const context = useContext(GetCurrentTeacherInvoicesContext);
    if (!context) {
        throw new Error('useGetCurrentTeacherInvoicesRepository must be used within a GetCurrentTeacherInvoicesProvider');
    }
    return context;
};