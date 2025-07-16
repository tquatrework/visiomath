import {Inject} from "@nestjs/common";
import {{UserStory1}Repository} from "./{userStory1}.repository";
import {{UserStory1}TypeOrmRepository} from "./{userStory1}.typeOrmRepository";
import {{UserStory1}QueryResult} from "./{userStory1}.queryResult";

export class {UserStory1}Usecase {

    constructor(
        @Inject({UserStory1}TypeOrmRepository)
        private {userStory1}Repository: {UserStory1}Repository
    ) {}

    async execute(userId: number): Promise<{UserStory1}QueryResult> {
        
        const result = await this.{userStory1}Repository.findByUserId(userId);
        
        if (!result) {
            throw new Error("Données introuvables.");
        }
        
        return result;
    }
}
