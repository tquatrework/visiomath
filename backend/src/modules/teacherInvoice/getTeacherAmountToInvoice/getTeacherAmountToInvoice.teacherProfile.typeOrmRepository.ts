import {Injectable} from "@nestjs/common";
import {DataSource} from "typeorm";
import {GetTeacherAmountToInvoiceQueryResult} from "./getTeacherAmountToInvoice.queryResult";
import {GetTeacherAmountToInvoiceTeacherProfileRepository} from "./getTeacherAmountToInvoice.teacherProfile.repository";

@Injectable()
export class GetTeacherAmountToInvoiceTeacherProfileTypeOrmRepository implements GetTeacherAmountToInvoiceTeacherProfileRepository {

    constructor(private dataSource: DataSource) {}

    async findTeacherAmountToInvoiceById(teacherId: number): Promise<GetTeacherAmountToInvoiceQueryResult | null> {
        const query = `
            SELECT 
                tp."amountToInvoice"
            FROM teacher_profiles tp
            INNER JOIN user_profiles up ON tp."userProfileId" = up.id
            INNER JOIN users u ON u."userProfileId" = up.id
            WHERE u.id = $1 AND u.role = 'teacher'
        `;

        const result = await this.dataSource.query(query, [teacherId]);
        
        if (!result || result.length === 0) {
            return null;
        }

        const row = result[0];
        return {
            amountToInvoice: parseFloat(row.amountToInvoice)
        };
    }
}
