import {render, waitFor, screen, act} from "@testing-library/react";
import { GetTeacherAmountToInvoiceProvider } from "../getTeacherAmountToInvoice.repository.provider";
import GetTeacherAmountToInvoiceComponent from "../GetTeacherAmountToInvoice.component";
import { GetTeacherAmountToInvoiceSuccessInMemoryRepository } from "./getTeacherAmountToInvoice.successInMemoryRepository";
import {MemoryRouter} from 'react-router-dom';
import {UserProvider} from "@src/providers/UserContext";
import TeacherInvoicePage from "@src/features/teacherInvoice/TeacherInvoice.page";
import {afterEach} from "vitest";

describe('#US-4: Affichage du solde à facturer du professeur', () => {

    afterEach(() => {
        localStorage.clear();
    });

    test('#US-4-AC-1: Affichage du solde de 50e réussie', async () => {

        // Etant donné que je suis connecté en tant que professeur avec un montant à facturer de 50e
        const mockTeacherAmountToInvoice = {
            amountToInvoice: 50,
        };

        // Quand je consulte mon solde à facturer
        render(<GetTeacherAmountToInvoiceProvider
            getTeacherAmountToInvoiceRepository={new GetTeacherAmountToInvoiceSuccessInMemoryRepository(mockTeacherAmountToInvoice)}>
            <GetTeacherAmountToInvoiceComponent/>
        </GetTeacherAmountToInvoiceProvider>);

        // Alors je dois voir mon solde à facturer à 50e
        expect(
          await screen.findByTestId('teacher-amount-to-invoice')
        ).toHaveTextContent('50');

    })

    test('#US-4-AC-4 : Affichage échoué – utilisateur pas professeur', async () => {

        // Étant donné que je suis identifié en tant que responsable financier
        localStorage.setItem('access_token', 'fake-token');
        localStorage.setItem('user_info', JSON.stringify({ 
            id: 1, 
            role: ['financial_admin']
        }));

        // Quand je veux consulter mon solde à facturer
        act(() => {
            render(
                <MemoryRouter>
                    <UserProvider>
                        <TeacherInvoicePage />
                    </UserProvider>
                </MemoryRouter>
            );
        });

        //Alors je ne peux pas afficher le solde
        expect(
          screen.queryByRole('tab', {name: /Facturer/i})
        ).not.toBeInTheDocument();

    })

})
