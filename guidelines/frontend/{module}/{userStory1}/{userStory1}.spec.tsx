import {describe, expect, test} from "vitest";
import {render, screen} from "@testing-library/react";
import { {userStory1}Provider } from "@src/features/{module}/{userStory1}/{userStory1}.repository.provider";
import { {userStory1}SuccessInMemoryRepository } from "@src/features/{module}/{userStory1}/{userStory1}.successInMemoryRepository";
import {userStory1}Component from "@src/features/{module}/{userStory1}/{userStory1}Component";
import { {userStory1}FailureInMemoryRepository } from "@src/features/{module}/{userStory1}/{userStory1}.failureInMemoryRepository";
import {
    {userStory1}CompanyType
} from "@src/features/{module}/{userStory1}/{userStory1}.queryResult";

describe('#US-2: Récupération des informations de paiement du professeur', async () => {

    test('#US-2-AC-1: Récupération réussie', async () => {

        // Etant donné que je suis connecté en tant que professeur avec ces informations bancaires stockées : 
        // nom de l'entreprise : "ProfCompany"
        // siret : "12345678912345"
        // type entreprise : Autoentrepreneur
        // assujetti TVA : non
        // IBAN : FR 1234567891234567891234567
        // Bic : azertyaz
        const mockPaymentInfo = {
            companyName: "ProfCompany",
            siret: "12345678912345",
            companyType: {userStory1}CompanyType.Autoentrepreneur,
            vatSubject: false,
            iban: "FR1234567891234567891234567",
            bic: "azertyaz"
        };

        // Quand je récupère mes informations de paiement
        render(<{userStory1}Provider
            {userStory1}Repository={new {userStory1}SuccessInMemoryRepository(mockPaymentInfo)}>
            <{userStory1}Component/>
        </{userStory1}Provider>);

        // Alors je dois voir : 
        // nom de l'entreprise : "ProfCompany"
        // siret : "12345678912345"
        // type entreprise : Autoentrepreneur
        // assujetti TVA : non
        // IBAN : FR1234567891234567891234567
        // Bic : azertyaz
        expect(
          await screen.findByTestId('company-name')
        ).toHaveTextContent('ProfCompany');
        expect(
          await screen.findByTestId('siret')
        ).toHaveTextContent('12345678912345');
        expect(
          await screen.findByTestId('company-type')
        ).toHaveTextContent('AE');
        expect(
          await screen.findByTestId('vat-subject')
        ).toHaveTextContent('non');
        expect(
          await screen.findByTestId('iban')
        ).toHaveTextContent('FR1234567891234567891234567');
        expect(
          await screen.findByTestId('bic')
        ).toHaveTextContent('azertyaz');

    })

    test('#US-2-AC-1: Récupération échouée', async () => {

        // Étant donné que je suis connecté en tant que professeur avec ces informations de paiement stockées : 
        // nom de l’entreprise : "ProfCompany"
        // siret : "12345678912345"
        // type entreprise : AE
        // assujetti TVA : non
        // IBAN : FR 1234567891234567891234567
        // Bic : azertyaz

        // Quand je récupère mes informations bancaire, si la récupération échoue

        // Alors une erreur "Impossible de récupérer les informations de paiement" doit être affichée
        render(
            <{userStory1}Provider
                {userStory1}Repository={new {userStory1}FailureInMemoryRepository()}
            >
                <{userStory1}Component/>
            </{userStory1}Provider>
        );

        expect(await screen.findByText(/Impossible de récupérer les informations de paiement/i)).toBeInTheDocument();

    })

})

