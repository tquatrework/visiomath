import {
    {userStory2}Repository
} from "@src/features/{module}/{userStory2}/{userStory2}.repository";
import {
    {UserStory2}Command
} from "@src/features/{module}/{userStory2}/{userStory2}.command";


export class {userStory2}FailureInMemoryRepository implements {userStory2}Repository {
    async execute (teacherPaymentInfo: {UserStory2}Command): Promise<void> {
        if (teacherPaymentInfo.siret.length < 14) {
            throw new Error("Le SIRET doit contenir 14 caractères");
        }
    }

}
