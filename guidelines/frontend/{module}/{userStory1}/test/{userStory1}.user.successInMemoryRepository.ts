import {
    {userStory1}QueryResult
} from "@src/features/{module}/{userStory1}/{userStory1}.queryResult";
import {
    {userStory1}Repository
} from "@src/features/{module}/{userStory1}/{userStory1}.repository";

export class UserStory1UserSuccessInMemoryRepository implements {userStory1}Repository {
    constructor(private mockData: {userStory1}QueryResult) {}

    async execute(): Promise<{userStory1}QueryResult> {
        return this.mockData;
    }
}
