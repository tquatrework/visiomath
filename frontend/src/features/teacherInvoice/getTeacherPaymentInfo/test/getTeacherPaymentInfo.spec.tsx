import {describe, expect, test} from "vitest";
import {render, screen} from "@testing-library/react";
import { GetTeacherPaymentInfoProvider } from "@src/features/teacherInvoice/getTeacherPaymentInfo/getTeacherPaymentInfo.repository.provider";
import { GetTeacherPaymentInfoSuccessInMemoryRepository } from "@src/features/teacherInvoice/getTeacherPaymentInfo/test/getTeacherPaymentInfo.successInMemoryRepository";
import { GetTeacherPaymentInfoFailureInMemoryRepository } from "@src/features/teacherInvoice/getTeacherPaymentInfo/test/getTeacherPaymentInfo.failureInMemoryRepository";
import TeacherPaymentInfoFormComponent from "@src/features/teacherInvoice/TeacherPaymentInfoForm.component";
import { GetTeacherPaymentInfoCompanyType } from "@src/features/teacherInvoice/getTeacherPaymentInfo/getTeacherPaymentInfo.queryResult";

describe('#US-2: Récupération des informations de paiement du professeur', async () => {

    test('#US-2-AC-2: Récupération réussie', async () => {

        // Etant donné que je suis connecté en tant que professeur avec ces informations bancaires stockées : 
        // nom de l'entreprise : "ProfCompany"
        // siret : "12345678912345"
        // type entreprise : SA
        // assujetti TVA : oui
        // IBAN : FR 1234567891234567891234567
        // Bic : azertyaz
        const mockPaymentInfo = {
            companyName: "ProfCompany",
            siret: "12345678912345",
            companyType: GetTeacherPaymentInfoCompanyType.SA,
            subjectToVat: true,
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
        // type entreprise : SA
        // assujetti TVA : oui
        // IBAN : FR 1234567891234567891234567
        // Bic : azertyaz
        expect(
          await screen.findByDisplayValue('ProfCompany')
        ).toBeInTheDocument();
        expect(
          await screen.findByDisplayValue('12345678912345')
        ).toBeInTheDocument();
        const companyTypeSelect = screen.getByLabelText(/Type entreprise/i);
        expect(companyTypeSelect).toHaveValue('SA');
        expect(
          await screen.findByDisplayValue('azertyaz')
        ).toBeInTheDocument();
        
        const subjectToVatCheckbox = screen.getByRole('checkbox', { name: /Assujetti TVA/i });
        expect(subjectToVatCheckbox).toBeChecked();

    })

    test('#US-2-AC-2: Récupération échouée', async () => {

        // Etant donné que je suis connecté en tant que professeur avec des informations bancaires stockées

        // Quand je récupère mes informations bancaire, si la récupération échoue
        render(
            <GetTeacherPaymentInfoProvider
                getTeacherPaymentInfoRepository={new GetTeacherPaymentInfoFailureInMemoryRepository()}>
                    <TeacherPaymentInfoFormComponent/>
            </GetTeacherPaymentInfoProvider>
        );

        // Alors une erreur "Impossible de récupérer les informations de paiement" doit être affichée
        expect(
            await screen.findByText('Erreur: Impossible de récupérer les informations de paiement')
        ).toBeInTheDocument();

    })

})
