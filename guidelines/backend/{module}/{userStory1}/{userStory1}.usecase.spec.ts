import {beforeEach, describe, expect, test} from "vitest";
import {{UserStory1}Usecase} from "./{userStory1}.usecase";
import {{UserStory1}InMemoryRepository} from "./{userStory1}.inMemoryRepository";
import {{UserStory1}QueryResult} from "./{userStory1}.queryResult";

describe('#{userStory1Id}: {userStory1Name}', () => {

    let {userStory1}InMemoryRepository: {UserStory1}InMemoryRepository;
    let {userStory1}Usecase: {UserStory1}Usecase;

    beforeEach(() => {
        {userStory1}InMemoryRepository = new {UserStory1}InMemoryRepository();
        {userStory1}Usecase = new {UserStory1}Usecase({userStory1}InMemoryRepository);
    });

    test('#{scenario1Id}: {scenario1Name}', async () => {
        // Etant donné que je suis connecté en tant qu'utilisateur
        // Et que j'ai des données enregistrées
        const expectedResult: {UserStory1}QueryResult = {
            name: "Dupont",
            firstName: "JeanPierre",
        };
        
        {userStory1}InMemoryRepository.seed(1, expectedResult);

        // Quand je demande mes données
        const result = await {userStory1}Usecase.execute(1);

        // Alors je dois recevoir mes données
        expect(result).toEqual(expectedResult);
    });

    test('#{scenario2Id}: {scenario2Name}', async () => {
        // Etant donné que je suis connecté en tant qu'utilisateur
        // Et que je n'ai pas de données enregistrées

        // Quand je demande mes données
        // Alors je dois recevoir une erreur
        await expect(
            {userStory1}Usecase.execute(999)
        ).rejects.toThrow("Données introuvables.");
    });
});
