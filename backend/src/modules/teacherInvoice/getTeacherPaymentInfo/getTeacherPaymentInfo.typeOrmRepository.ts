import {Injectable} from "@nestjs/common";
import {DataSource} from "typeorm";
import {GetTeacherPaymentInfoRepository} from "./getTeacherPaymentInfo.repository";
import {GetTeacherPaymentInfoQueryResult} from "./getTeacherPaymentInfo.queryResult";
import {CompanyType} from "../../../shared/entities/teacherProfile.entity";

@Injectable()
export class GetTeacherPaymentInfoTypeOrmRepository implements GetTeacherPaymentInfoRepository {

    constructor(private dataSource: DataSource) {}

    async findByTeacherId(teacherId: number): Promise<GetTeacherPaymentInfoQueryResult | null> {
        const query = `
            SELECT 
                tp."companyName",
                tp."siret",
                tp."companyType",
                tp."vatExempt",
                tp."iban",
                tp."bic"
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
            companyName: row.companyName,
            siret: row.siret,
            companyType: row.companyType as CompanyType,
            vatExempt: row.vatExempt,
            iban: row.iban,
            bic: row.bic
        };
    }
}
