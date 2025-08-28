import {{UserStory1}QueryResult} from "./{userStory1}.queryResult";

export interface {UserStory1}UserRepository {
    findByUserId(userId: number): Promise<{UserStory1}QueryResult | null>;
}
