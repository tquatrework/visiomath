import React, { createContext, useContext, ReactNode } from 'react';
import { GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceRepository } from './getTeacherInvoicesNumberForCurrentMonth.teacherInvoice.repository';

interface GetTeacherInvoicesNumberForCurrentMonthProviderProps {
  getTeacherInvoicesNumberForCurrentMonthTeacherInvoiceRepository: GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceRepository;
  children: ReactNode;
}

const GetTeacherInvoicesNumberForCurrentMonthContext = createContext<GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceRepository | undefined>(undefined);

export function GetTeacherInvoicesNumberForCurrentMonthProvider({
  getTeacherInvoicesNumberForCurrentMonthTeacherInvoiceRepository,
  children,
}: GetTeacherInvoicesNumberForCurrentMonthProviderProps) {
  return (
    <GetTeacherInvoicesNumberForCurrentMonthContext.Provider value={getTeacherInvoicesNumberForCurrentMonthTeacherInvoiceRepository}>
      {children}
    </GetTeacherInvoicesNumberForCurrentMonthContext.Provider>
  );
}

export function useGetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceRepository(): GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceRepository {
  const repository = useContext(GetTeacherInvoicesNumberForCurrentMonthContext);
  if (!repository) {
    throw new Error('useGetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceRepository must be used within a GetTeacherInvoicesNumberForCurrentMonthProvider');
  }
  return repository;
}