import {{UserStory1}Repository} from "./{userStory1}.repository";
import {{UserStory1}QueryResult} from "./{userStory1}.queryResult";

export class {UserStory1}UserInMemoryRepository implements {UserStory1}Repository {
    private data: Map<number, {UserStory1}QueryResult> = new Map();

    async findByUserId(userId: number): Promise<{UserStory1}QueryResult | null> {
        return this.data.get(userId) || null;
    }

    seed(userId: number, data: {UserStory1}QueryResult): void {
        this.data.set(userId, data);
    }
}
