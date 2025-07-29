import React, { createContext, useContext, ReactNode } from 'react';
import { GetTeacherInvoiceDetailTeacherInvoiceRepository } from './getTeacherInvoiceDetail.teacherInvoice.repository';

type GetTeacherInvoiceDetailProviderProps = {
  children: ReactNode;
  getTeacherInvoiceDetailRepository: GetTeacherInvoiceDetailTeacherInvoiceRepository;
};

const GetTeacherInvoiceDetailContext = createContext<GetTeacherInvoiceDetailTeacherInvoiceRepository | null>(null);

export const GetTeacherInvoiceDetailProvider: React.FC<GetTeacherInvoiceDetailProviderProps> = ({
  children,
  getTeacherInvoiceDetailRepository
}) => {
  return (
    <GetTeacherInvoiceDetailContext.Provider value={getTeacherInvoiceDetailRepository}>
      {children}
    </GetTeacherInvoiceDetailContext.Provider>
  );
};

export const useGetTeacherInvoiceDetailRepository = (): GetTeacherInvoiceDetailTeacherInvoiceRepository => {
  const context = useContext(GetTeacherInvoiceDetailContext);
  if (!context) {
    throw new Error('useGetTeacherInvoiceDetailRepository must be used within a GetTeacherInvoiceDetailProvider');
  }
  return context;
};