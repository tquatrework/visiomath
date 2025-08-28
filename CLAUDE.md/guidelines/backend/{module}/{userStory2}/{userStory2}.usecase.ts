import {Inject} from "@nestjs/common";
import {{UserStory2}Repository} from "./{userStory2}.repository";
import {{UserStory2}TypeOrmRepository} from "./{userStory2}.typeOrmRepository";
import {{UserStory2}Command} from "./{userStory2}.command";

export class {UserStory2}Usecase {

    constructor(
        @Inject({UserStory2}TypeOrmRepository)
        private {userStory2}Repository: {UserStory2}Repository
    ) {}

    async execute(userId: number, {userStory2}Command: {UserStory2}Command): Promise<void> {
        
        const user = await this.{userStory2}Repository.findById(userId);
        
        if (!user) {
            throw new Error("Utilisateur introuvable.");
        }

        user.update{UserStory2}({userStory2}Command);

        try {
            await this.{userStory2}Repository.save(user);
            return;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error("Erreur lors de l'enregistrement.");
            }
            throw new Error("Erreur interne du serveur.");
        }
    }
}
