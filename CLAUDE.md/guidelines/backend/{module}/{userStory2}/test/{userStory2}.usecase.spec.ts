import {beforeEach, describe, expect, test} from "vitest";
import {{UserStory2}Usecase} from "../{userStory2}.usecase";
import {{UserStory2}InMemoryRepository} from "./{userStory2}.inMemoryRepository";
import {User} from "../../../../shared/entities/user.entity";
import {{UserStory2}Command} from "../{userStory2}.command";

const generateUser = (userId: number) => {
    const user = new User();
    user.id = userId;
    return user;
}

describe('#{userStory2Id}: {userStory2Name}', () => {


    test('#{scenario1Id}: {scenario1Name}', async () => {
        // Etant donné que je suis connecté en tant qu'utilisateur

        const user = generateUser(1);

        const {userStory2}InMemoryRepository = new {UserStory2}InMemoryRepository();
        {userStory2}InMemoryRepository.seed(user);

        const {userStory2}Usecase = new {UserStory2}Usecase({userStory2}InMemoryRepository);


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
        {userStory2}InMemoryRepository.seed(user);

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
        {userStory2}InMemoryRepository.seed(user);

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
