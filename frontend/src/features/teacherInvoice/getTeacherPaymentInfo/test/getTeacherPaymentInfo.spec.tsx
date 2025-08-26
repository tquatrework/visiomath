import {describe, expect, test, afterEach} from "vitest";
import {render, screen, act} from "@testing-library/react";
import { GetTeacherPaymentInfoProvider } from "@src/features/teacherInvoice/getTeacherPaymentInfo/getTeacherPaymentInfo.repository.provider";
import { GetTeacherPaymentInfoSuccessInMemoryRepository } from "@src/features/teacherInvoice/getTeacherPaymentInfo/test/getTeacherPaymentInfo.successInMemoryRepository";
import { GetTeacherPaymentInfoFailureInMemoryRepository } from "@src/features/teacherInvoice/getTeacherPaymentInfo/test/getTeacherPaymentInfo.failureInMemoryRepository";
import TeacherPaymentInfoFormComponent from "@src/features/teacherInvoice/TeacherPaymentInfoForm.component";
import { GetTeacherPaymentInfoCompanyType } from "@src/features/teacherInvoice/getTeacherPaymentInfo/getTeacherPaymentInfo.queryResult";
import {MemoryRouter} from 'react-router-dom';
import {UserProvider} from "@src/providers/UserContext";
import TeacherInvoicePage from "@src/features/teacherInvoice/TeacherInvoice.page";

describe('#US-2: Récupération des informations de paiement du professeur', async () => {

    afterEach(() => {
        localStorage.clear();
    });

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

    test('#US-2-AC-4 : Récupération échoué – utilisateur pas professeur', async () => {

        // Étant donné que je suis identifié en tant que responsable financier
        localStorage.setItem('access_token', 'fake-token');
        localStorage.setItem('user_info', JSON.stringify({ 
            id: 1, 
            role: ['financial_admin']
        }));

        // Quand je veux récupérer mes informations bancaires
        act(() => {
            render(
                <MemoryRouter>
                    <UserProvider>
                        <TeacherInvoicePage />
                    </UserProvider>
                </MemoryRouter>
            );
        });

        //Alors je ne peux pas les récupérer
        expect(
          screen.queryByRole('tab', {name: /Informations de facturation/i})
        ).not.toBeInTheDocument();

    })

})
