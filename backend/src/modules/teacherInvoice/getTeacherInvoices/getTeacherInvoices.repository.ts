import { GetTeacherInvoicesQueryResult } from './getTeacherInvoices.queryResult';

export interface User {
  id: number;
  role: string;
}

export interface GetTeacherInvoicesRepository {
  getTeacherInvoices(): Promise<GetTeacherInvoicesQueryResult>;
  findUserById(userId: number): Promise<User | null>;
}