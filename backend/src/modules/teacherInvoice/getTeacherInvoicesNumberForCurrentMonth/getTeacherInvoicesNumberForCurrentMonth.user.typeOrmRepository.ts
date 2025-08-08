import {Injectable} from "@nestjs/common";
import {DataSource} from "typeorm";
import {GetTeacherInvoicesNumberForCurrentMonthUserRepository, UserWithRole} from "./getTeacherInvoicesNumberForCurrentMonth.user.repository";

@Injectable()
export class GetTeacherInvoicesNumberForCurrentMonthUserTypeOrmRepository implements GetTeacherInvoicesNumberForCurrentMonthUserRepository {

    constructor(private dataSource: DataSource) {}

    async findUserById(userId: number): Promise<UserWithRole | null> {
        const query = `
            SELECT id, role
            FROM users
            WHERE id = $1
        `;

        const result = await this.dataSource.query(query, [userId]);

        if (!result || result.length === 0) {
            return null;
        }

        const row = result[0];
        return {
            id: row.id,
            role: row.role
        };
    }
}