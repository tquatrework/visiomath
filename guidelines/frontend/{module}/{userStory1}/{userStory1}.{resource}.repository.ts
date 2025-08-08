import {
    {userStory1}QueryResult
} from "@src/features/{module}/{userStory1}/{userStory1}.queryResult";

export interface UserStory1UserRepository {
    execute(): Promise<{userStory1}QueryResult>
}
