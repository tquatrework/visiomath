import {describe, expect, test, afterEach} from "vitest";
import {render, screen, act} from "@testing-library/react";
import { GetTeacherInvoicesNumberForCurrentMonthProvider } from '../getTeacherInvoicesNumberForCurrentMonth.teacherInvoice.repository.provider';
import { GetTeacherInvoicesNumberForCurrentMonthComponent } from '../GetTeacherInvoicesNumberForCurrentMonth.component';
import { GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceSuccessInMemoryRepository } from './getTeacherInvoicesNumberForCurrentMonth.teacherInvoice.successInMemoryRepository';
import { GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceFailureInMemoryRepository } from './getTeacherInvoicesNumberForCurrentMonth.teacherInvoice.failureInMemoryRepository';
import {MemoryRouter} from 'react-router-dom';
import {UserProvider} from "@src/providers/UserContext";
import TeacherInvoicePage from "@src/features/teacherInvoice/TeacherInvoice.page";

describe('US-13 : Affichage du nombre de facture du professeur pour le mois en cours', async () => {

    afterEach(() => {
        localStorage.clear();
    });
    

    test('US-13-AC-1: récupération réussie', async () => {

        // Etant donné que je suis connecté en tant que professeur avec deux factures créées pour le mois en cours

        // Quand j'affiche le nombre de factures pour le mois en cours
        render(<GetTeacherInvoicesNumberForCurrentMonthProvider
            getTeacherInvoicesNumberForCurrentMonthTeacherInvoiceRepository={new GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceSuccessInMemoryRepository()}>
            <GetTeacherInvoicesNumberForCurrentMonthComponent/>
        </GetTeacherInvoicesNumberForCurrentMonthProvider>);

        // Alors je dois recevoir "2"
        expect(
          await screen.findByTestId('teacher-invoices-number-for-current-month')
        ).toHaveTextContent('2');

    })

    test('US-13-AC-3: Récupération échouée : utilisateur pas professeur', async () => {

        // Etant donné que je suis connecté en tant que responsable financier 

        // Quand j'affiche le nombre de factures pour le mois en cours
        render(<GetTeacherInvoicesNumberForCurrentMonthProvider
            getTeacherInvoicesNumberForCurrentMonthTeacherInvoiceRepository={new GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceFailureInMemoryRepository()}>
            <GetTeacherInvoicesNumberForCurrentMonthComponent/>
        </GetTeacherInvoicesNumberForCurrentMonthProvider>);

        // Alors je dois recevoir une erreur "Vous ne pouvez pas effectuer cette opération"
        expect(
          await screen.findByText('Erreur: Vous ne pouvez pas effectuer cette opération')
        ).toBeInTheDocument();

    })

    test('#US-13-AC-4: Récupération échouée : utilisateur pas professeur', async () => {

        // Etant donné que je suis connecté en tant que responsable financier
        localStorage.setItem('access_token', 'fake-token');
        localStorage.setItem('user_info', JSON.stringify({
            id: 1,
            role: ['financial_admin']
        }));

        // Quand je veux afficher le nombre de factures pour le mois en cours
        act(() => {
            render(
                <MemoryRouter>
                    <UserProvider>
                        <TeacherInvoicePage />
                    </UserProvider>
                </MemoryRouter>
            );
        });

        //Alors je ne peux pas afficher les factures
        expect(
          screen.queryByRole('tab', {name: /Facturer/i})
        ).not.toBeInTheDocument();

    })

})