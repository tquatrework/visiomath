import {
    {userStory1}QueryResult
} from "@src/features/{module}/{userStory1}/{userStory1}.queryResult";
import {
    {userStory1}Repository
} from "@src/features/{module}/{userStory1}/{userStory1}.repository";

export class UserStory1UserFailureInMemoryRepository implements {userStory1}Repository {
    async execute(): Promise<{userStory1}QueryResult> {
        throw new Error("Impossible de récupérer les informations de paiement");
    }
}
