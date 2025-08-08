import {Injectable} from "@nestjs/common";
import {DataSource} from "typeorm";
import {GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceRepository} from "./getTeacherInvoicesNumberForCurrentMonth.teacherInvoice.repository";
import {GetTeacherInvoicesNumberForCurrentMonthQueryResult} from "./getTeacherInvoicesNumberForCurrentMonth.queryResult";

@Injectable()
export class GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceTypeOrmRepository implements GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceRepository {

    constructor(private dataSource: DataSource) {}

    async getTeacherInvoicesNumberForCurrentMonth(teacherId: number): Promise<GetTeacherInvoicesNumberForCurrentMonthQueryResult> {
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        const query = `
            SELECT COUNT(*) as count
            FROM teacher_invoices ti
            WHERE ti."teacherId" = $1 
            AND ti."creationDate" >= $2 
            AND ti."creationDate" <= $3
        `;

        const result = await this.dataSource.query(query, [teacherId, firstDayOfMonth, lastDayOfMonth]);

        return {
            number: parseInt(result[0].count)
        };
    }
}