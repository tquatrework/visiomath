import {describe, expect, test} from "vitest";
import {render, screen} from "@testing-library/react";
import { {userStory1}Provider } from "@src/features/{module}/{userStory1}/{userStory1}.repository.provider";
import { {userStory1}SuccessInMemoryRepository } from "@src/features/{module}/{userStory1}/{userStory1}.successInMemoryRepository";
import {userStory1}Component from "@src/features/{module}/{userStory1}/{userStory1}Component";
import { {userStory1}FailureInMemoryRepository } from "@src/features/{module}/{userStory1}/{userStory1}.failureInMemoryRepository";
import {
    {userStory1}CompanyType
} from "@src/features/{module}/{userStory1}/{userStory1}.queryResult";

describe('#{userStory1ID}: {userStory1}', async () => {

    test('#{scenario1ID}: {scenario1Name}', async () => {

        // Etant donné que je suis connecté en tant que xxxx avec ces informations stockées :
        const mock{userStory1} = {
            name: "Dupont",
            prenom: "Jean-Pierre"
        };

        // Quand je récupère mes informations
        render(<{userStory1}Provider
            {userStory1}Repository={new {userStory1}SuccessInMemoryRepository(mock{userStory1})}>
            <{userStory1}Component/>
        </{userStory1}Provider>);

        // Alors je dois voir : 
        // nom : "Dupont"
        // prénom : "Jean-Pierre"
        expect(await screen.findByDisplayValue('Dupont')).toBeInTheDocument();
        expect(await screen.findByDisplayValue('Jean-Pierre')).toBeInTheDocument();

    })

    test('#{scenario2ID}: {scenario2Name}', async () => {

        // Etant donné que je suis connecté en tant que xxxx avec ces informations stockées :
        const mock{userStory1} = {
            name: "Dupont",
            prenom: "Jean-Pierre"
        };

        // Quand je récupère mes informations, si la récupération échoue

        // Alors une erreur "Impossible de récupérer les informations" doit être affichée
        render(
            <{userStory1}Provider
                {userStory1}Repository={new {userStory1}FailureInMemoryRepository()}
            >
                <{userStory1}Component/>
            </{userStory1}Provider>
        );

        expect(await screen.findByText(/Impossible de récupérer les informations/i)).toBeInTheDocument();

    })

})

