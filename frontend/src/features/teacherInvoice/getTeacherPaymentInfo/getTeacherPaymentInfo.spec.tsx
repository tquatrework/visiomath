import {beforeEach, describe, expect, MockInstance, test, vi} from "vitest";
import {render, screen, waitFor} from "@testing-library/react";
import { GetTeacherPaymentInfoProvider } from "@src/features/teacherInvoice/getTeacherPaymentInfo/getTeacherPaymentInfo.repository.provider";
import { GetTeacherPaymentInfoSuccessInMemoryRepository } from "@src/features/teacherInvoice/getTeacherPaymentInfo/getTeacherPaymentInfo.successInMemoryRepository";
import { GetTeacherPaymentInfoFailureInMemoryRepository } from "@src/features/teacherInvoice/getTeacherPaymentInfo/getTeacherPaymentInfo.failureInMemoryRepository";
import TeacherPaymentInfoFormComponent from "@src/features/teacherInvoice/TeacherPaymentInfoFormComponent";
import { GetTeacherPaymentInfoCompanyType } from "@src/features/teacherInvoice/getTeacherPaymentInfo/getTeacherPaymentInfo.queryResult";

describe('#US-2: Récupération des informations de paiement du professeur', async () => {

    let alertSpy: MockInstance;

    beforeEach(() => {
        alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    })


    test('#{scenarioID}: {scenarioName}', async () => {

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
            companyType: GetTeacherPaymentInfoCompanyType.Autoentrepreneur,
            vatSubject: false,
            iban: "FR 1234567891234567891234567",
            bic: "azertyaz"
        };

        // Quand je récupère mes informations bancaire
        render(
            <GetTeacherPaymentInfoProvider
                getTeacherPaymentInfoRepository={new GetTeacherPaymentInfoSuccessInMemoryRepository(mockPaymentInfo)}>
                    <TeacherPaymentInfoFormComponent/>
            </GetTeacherPaymentInfoProvider>
        );

        // Alors je dois voir : 
        // nom de l'entreprise : "ProfCompany"
        // siret : "12345678912345"
        // type entreprise : Autoentrepreneur
        // assujetti TVA : non
        // IBAN : FR 1234567891234567891234567
        // Bic : azertyaz
        expect(
          await screen.findByDisplayValue('ProfCompany')
        ).toBeInTheDocument();
        expect(
          await screen.findByDisplayValue('12345678912345')
        ).toBeInTheDocument();
        expect(
          await screen.findByDisplayValue('Autoentrepreneur')
        ).toBeInTheDocument();
        expect(
          await screen.findByDisplayValue('FR 1234567891234567891234567')
        ).toBeInTheDocument();
        expect(
          await screen.findByDisplayValue('azertyaz')
        ).toBeInTheDocument();
        
        const vatExemptCheckbox = screen.getByRole('checkbox', { name: /Assujetti TVA/i });
        expect(vatExemptCheckbox).not.toBeChecked();

    })

    test('#US-2-AC-2: Récupération échouée', async () => {

        // Etant donné que je suis connecté en tant que professeur avec ces informations de paiement stockées :
        // nom de l'entreprise : "ProfCompany"
        // siret : "12345678912345"
        // type entreprise : Autoentrepreneur
        // assujetti TVA : non
        // IBAN : FR 1234567891234567891234567
        // Bic : azertyaz

        // Quand je récupère mes informations bancaire, si la récupération échoue
        render(
            <GetTeacherPaymentInfoProvider
                getTeacherPaymentInfoRepository={new GetTeacherPaymentInfoFailureInMemoryRepository()}>
                    <TeacherPaymentInfoFormComponent/>
            </GetTeacherPaymentInfoProvider>
        );

        // Alors une erreur "Impossible de récupérer les informations de paiement" doit être affichée
        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('Impossible de récupérer les informations de paiement')
        })

    })

})
