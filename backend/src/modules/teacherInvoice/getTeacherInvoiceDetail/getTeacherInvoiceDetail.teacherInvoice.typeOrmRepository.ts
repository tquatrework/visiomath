import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { GetTeacherInvoiceDetailRepository } from './getTeacherInvoiceDetail.repository';
import { GetTeacherInvoiceDetailQueryResult } from './getTeacherInvoiceDetail.queryResult';

@Injectable()
export class GetTeacherInvoiceDetailTeacherInvoiceTypeOrmRepository implements GetTeacherInvoiceDetailRepository {
  constructor(private readonly dataSource: DataSource) {}

  async getById(id: number): Promise<GetTeacherInvoiceDetailQueryResult> {
    try {
      const result = await this.dataSource.query(
        `SELECT 
          ti.id,
          CONCAT(u."firstName", ' ', u."lastName") as "teacherName",
          ti.amount,
          ti."pdfFile",
          ti."creationDate"
        FROM teacher_invoices ti
        INNER JOIN users u ON ti."teacherId" = u.id
        WHERE ti.id = $1`,
        [id]
      );

      if (result.length === 0) {
        throw new Error('Facture non trouvée');
      }

      return {
        id: result[0].id,
        teacherName: result[0].teacherName,
        amount: result[0].amount,
        pdfFile: result[0].pdfFile,
        creationDate: result[0].creationDate
      };
    } catch (error) {
      throw new Error('Erreur BDD');
    }
  }
}