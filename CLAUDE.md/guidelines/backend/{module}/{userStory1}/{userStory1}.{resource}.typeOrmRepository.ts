import {Injectable} from "@nestjs/common";
import {DataSource} from "typeorm";
import {{UserStory1}Repository} from "./{userStory1}.repository";
import {{UserStory1}QueryResult} from "./{userStory1}.queryResult";

@Injectable()
export class {UserStory1}UserTypeOrmRepository implements {UserStory1}Repository {

    constructor(private dataSource: DataSource) {}

    async findByUserId(userId: number): Promise<{UserStory1}QueryResult | null> {
        const query = `
            SELECT 
                u.name,
                u.firstName
            FROM users u
            WHERE u.id = $1
        `;

        const result = await this.dataSource.query(query, [userId]);
        
        if (!result || result.length === 0) {
            return null;
        }

        const row = result[0];
        return {
            name: row.name,
            firstName: row.firstName
        };
    }
}
