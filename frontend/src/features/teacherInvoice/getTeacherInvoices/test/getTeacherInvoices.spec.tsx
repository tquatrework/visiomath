import {describe, expect, test, afterEach} from "vitest";
import {render, screen, act} from "@testing-library/react";
import { MemoryRouter } from 'react-router-dom';
import { GetTeacherInvoicesProvider } from '../getTeacherInvoices.repository.provider';
import { GetTeacherInvoicesComponent } from '../GetTeacherInvoices.component';
import { GetTeacherInvoicesSuccessInMemoryRepository } from './getTeacherInvoices.successInMemoryRepository';
import {UserProvider} from "@src/providers/UserContext";
import TeacherInvoicePage from "@src/features/teacherInvoice/TeacherInvoice.page";

describe('US-7: Visualisation de la facture', async () => {

    afterEach(() => {
        localStorage.clear();
    });

    test('US-7-AC-1: Visualisation réussie', async () => {

        // Etant donné que je suis connecté en tant que responsable financier et que le professeur David Robert a une facture de 600e avec un id de 1

        // Quand je veux visualiser toutes les factures, si tout se passe bien
        render(
            <MemoryRouter>
                <GetTeacherInvoicesProvider
                    getTeacherInvoicesRepository={new GetTeacherInvoicesSuccessInMemoryRepository()}>
                    <GetTeacherInvoicesComponent/>
                </GetTeacherInvoicesProvider>
            </MemoryRouter>
        );

        // Alors je dois voir la facture id 1 à 600e de David Robert dans le tableau
        const invoiceRow = await screen.findByTestId('teacher-invoice-1');
        expect(invoiceRow).toHaveTextContent('David Robert');
        expect(invoiceRow).toHaveTextContent('600€');
        expect(invoiceRow).toHaveTextContent('en attente de validation');
        expect(invoiceRow).toHaveTextContent('01/01/2024');
        expect(invoiceRow).toHaveTextContent('Voir la facture');

    })

    test('#US-7-AC-4: Visualisation échouée : utilisateur pas responsable financier', async () => {

        // Etant donné que je suis connecté en tant que professeur
        localStorage.setItem('access_token', 'fake-token');
        localStorage.setItem('user_info', JSON.stringify({
            id: 1,
            role: ['teacher']
        }));

        // Quand je veux visualiser toutes les factures
        act(() => {
            render(
                <MemoryRouter>
                    <UserProvider>
                        <TeacherInvoicePage />
                    </UserProvider>
                </MemoryRouter>
            );
        });

        //Alors je ne peux visualiser les factures
        expect(
          screen.queryByRole('tab', {name: /Liste des factures/i})
        ).not.toBeInTheDocument();

    })

})