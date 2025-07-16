import {beforeEach, describe, expect, test} from "vitest";
import {{UserStory2}Usecase} from "./{userStory2}.usecase";
import {UserInMemoryRepository} from "../../users/user.inMemoryRepository";
import {User} from "../../../shared/entities/user.entity";
import {{UserStory2}Command} from "./{userStory2}.command";

const generateUser = (userId: number) => {
    const user = new User();
    user.id = userId;
    return user;
}

describe('#{userStory2Id}: {userStory2Name}', () => {

    let userInMemoryRepository: UserInMemoryRepository;
    let {userStory2}Usecase: {UserStory2}Usecase;

    beforeEach(() => {
        userInMemoryRepository = new UserInMemoryRepository();
        {userStory2}Usecase = new {UserStory2}Usecase(userInMemoryRepository);
    });

    test('#{scenario1Id}: {scenario1Name}', async () => {
        // Etant donné que je suis connecté en tant qu'utilisateur
        const user = generateUser(1);
        userInMemoryRepository.seed(user);

        // Quand j'enregistre mes données
        const {userStory2}Command: {UserStory2}Command = {
            name: "Dupont",
            firstName: "JeanPierre"
        };

        await expect(
            {userStory2}Usecase.execute(1, {userStory2}Command)
        // Alors mon enregistrement doit être confirmé
        ).resolves.not.toThrow();
    });

    test('#{scenario2Id}: {scenario2Name}', async () => {
        // Etant donné que je suis connecté en tant qu'utilisateur
        const user = generateUser(1);
        userInMemoryRepository.seed(user);

        // Quand j'enregistre avec des données invalides
        const {userStory2}Command: {UserStory2}Command = {
            name: "", // nom vide
            firstName: "JeanPierre"
        };

        await expect(
            {userStory2}Usecase.execute(1, {userStory2}Command)
        // Alors mon enregistrement doit renvoyer une erreur
        ).rejects.toThrow("Le nom est obligatoire.");
    });

    test('#{scenario3Id}: {scenario3Name}', async () => {
        // Etant donné que je ne suis pas connecté / utilisateur inexistant
        const user = generateUser(1);
        userInMemoryRepository.seed(user);

        // Quand j'enregistre mes données
        const {userStory2}Command: {UserStory2}Command = {
            name: "Dupont",
            firstName: "JeanPierre"
        };

        await expect(
            {userStory2}Usecase.execute(999, {userStory2}Command)
        // Alors mon enregistrement doit renvoyer une erreur
        ).rejects.toThrow("Utilisateur introuvable.");
    });
});
