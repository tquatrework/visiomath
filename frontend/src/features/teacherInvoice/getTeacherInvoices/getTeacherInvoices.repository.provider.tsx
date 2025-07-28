import React, { createContext, ReactNode } from 'react';
import { GetTeacherInvoicesRepository } from './getTeacherInvoices.repository';

export const GetTeacherInvoicesRepositoryContext = createContext<GetTeacherInvoicesRepository>(null as any);

interface GetTeacherInvoicesProviderProps {
  children: ReactNode;
  getTeacherInvoicesRepository: GetTeacherInvoicesRepository;
}

export const GetTeacherInvoicesProvider: React.FC<GetTeacherInvoicesProviderProps> = ({
  children,
  getTeacherInvoicesRepository
}) => {
  return (
    <GetTeacherInvoicesRepositoryContext.Provider value={getTeacherInvoicesRepository}>
      {children}
    </GetTeacherInvoicesRepositoryContext.Provider>
  );
};