import {Inject} from "@nestjs/common";
import {UserRepository} from "../../users/user.repository";
import {UserTypeOrmRepository} from "../../users/user.typeOrmRepository";
import {{UserStory2}Command} from "./{userStory2}.command";

export class {UserStory2}Usecase {

    constructor(
        @Inject(UserTypeOrmRepository)
        private userRepository: UserRepository
    ) {}

    async execute(userId: number, {userStory2}Command: {UserStory2}Command): Promise<void> {
        
        const user = await this.userRepository.findById(userId);
        
        if (!user) {
            throw new Error("Utilisateur introuvable.");
        }

        user.update{UserStory2}({userStory2}Command);

        try {
            await this.userRepository.save(user);
            return;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error("Erreur lors de l'enregistrement.");
            }
            throw new Error("Erreur interne du serveur.");
        }
    }
}
