import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { GetTeacherInvoicesInvoicesRepository } from './getTeacherInvoices.invoicesRepository';
import { GetTeacherInvoicesQueryResult } from './getTeacherInvoices.queryResult';

@Injectable()
export class GetTeacherInvoicesTypeOrmRepository implements GetTeacherInvoicesInvoicesRepository {
  constructor(private readonly dataSource: DataSource) {}

  async getTeacherInvoices(): Promise<GetTeacherInvoicesQueryResult> {
    try {
      const teacherInvoices = await this.dataSource.query(`
        SELECT 
          ti.id,
          ti.amount,
          ti."pdfFile",
          ti."creationDate",
          ti.status,
          CONCAT(u."firstName", ' ', u."lastName") as "teacherName"
        FROM teacher_invoices ti
        INNER JOIN users u ON ti."teacherId" = u.id
        ORDER BY ti."creationDate" DESC
      `);

      return {
        teacherInvoices
      };
    } catch (error) {
      throw new Error('la récupération des factures à échoué');
    }
  }
}