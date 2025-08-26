import {describe, expect, test, afterEach} from "vitest";
import {render, screen, act} from "@testing-library/react";
import { GetCurrentTeacherInvoicesProvider } from "../getCurrentTeacherInvoices.teacherInvoice.repository.provider";
import { GetCurrentTeacherInvoicesComponent } from "../GetCurrentTeacherInvoices.component";
import { GetCurrentTeacherInvoicesSuccessInMemoryRepository, GetCurrentTeacherInvoicesUnauthorizedInMemoryRepository } from "./getCurrentTeacherInvoices.teacherInvoice.inMemoryRepositories";
import {MemoryRouter} from 'react-router-dom';
import {UserProvider} from "@src/providers/UserContext";
import TeacherInvoicePage from "@src/features/teacherInvoice/TeacherInvoice.page";


describe('#US-12: Visualisation historique de factures pour le professeur', async () => {

    afterEach(() => {
        localStorage.clear();
    });
  
    test('#US-12-AC-1: Visualisation réussie', async () => {

        // Etant donné que je suis connecté en tant que professeur "David Robert" et que j'ai une facture id 1, validée, créée le 12/12/23 avec un montant de 300e

        // Quand je veux visualiser toutes mes factures
        render(<GetCurrentTeacherInvoicesProvider
            getCurrentTeacherInvoicesRepository={new GetCurrentTeacherInvoicesSuccessInMemoryRepository()}>
            <GetCurrentTeacherInvoicesComponent/>
        </GetCurrentTeacherInvoicesProvider>);

        // Alors je dois voir la facture id 1, validée, à 300e, créée le 12/12/23
        expect(
          await screen.findByTestId('invoice-id-1')
        ).toHaveTextContent('1');
        
        expect(
          await screen.findByTestId('invoice-status-1')
        ).toHaveTextContent('validée');
        
        expect(
          await screen.findByTestId('invoice-amount-1')
        ).toHaveTextContent('300');
        
        expect(
          await screen.findByTestId('invoice-creation-date-1')
        ).toHaveTextContent('12/12/23');
        
        expect(
          await screen.findByTestId('invoice-pdf-download-1')
        ).toHaveAttribute('href', '/uploads/facture-david-robert.pdf');
        
    })

    test('#US-12-AC-4: Récupération échouée : utilisateur pas professeur', async () => {

        // Etant donné que je suis connecté en tant que responsable financier

        // Quand j'affiche le nombre de factures pour le mois en cours
        render(<GetCurrentTeacherInvoicesProvider
            getCurrentTeacherInvoicesRepository={new GetCurrentTeacherInvoicesUnauthorizedInMemoryRepository()}>
            <GetCurrentTeacherInvoicesComponent/>
        </GetCurrentTeacherInvoicesProvider>);

        // Alors je dois recevoir une erreur "Vous ne pouvez pas effectuer cette opération"
        expect(
          await screen.findByText('Erreur: Vous ne pouvez pas effectuer cette opération')
        ).toBeInTheDocument();

    })

    test('#US-12-AC-4: Visualisation échouée : utilisateur pas professeur', async () => {

        // Etant donné que je suis connecté en tant que Responsable financier
        localStorage.setItem('access_token', 'fake-token');
        localStorage.setItem('user_info', JSON.stringify({
            id: 1,
            role: ['financial_admin']
        }));

        // Quand je veux visualiser toutes mes factures
        act(() => {
            render(
                <MemoryRouter>
                    <UserProvider>
                        <TeacherInvoicePage />
                    </UserProvider>
                </MemoryRouter>
            );
        });

        //Alors je ne peux pas visualiser mes factures
        expect(
          screen.queryByRole('tab', {name: /Mes factures/i})
        ).not.toBeInTheDocument();

    })


})