import { GetTeacherInvoicesInvoicesRepository } from '../getTeacherInvoices.invoicesRepository';
import { GetTeacherInvoicesQueryResult } from '../getTeacherInvoices.queryResult';

export class GetTeacherInvoicesInvoicesFailureInMemoryRepository implements GetTeacherInvoicesInvoicesRepository {
  async getTeacherInvoices(): Promise<GetTeacherInvoicesQueryResult> {
    throw new Error('Erreur de base de données');
  }
}