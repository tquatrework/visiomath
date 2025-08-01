import {describe, expect, test} from "vitest";
import {render, screen, act} from "@testing-library/react";
import userEvent from '@testing-library/user-event'
import CreateTeacherInvoiceComponent from "../CreateTeacherInvoice.component";
import {
    CreateTeacherInvoiceRepositoryProvider
} from "../createTeacherInvoice.repository.provider";
import {
    CreateTeacherInvoiceSuccessInMemoryRepository,
} from "./createTeacherInvoice.successInMemoryRepository";
import {
    CreateTeacherInvoiceFailureInMemoryRepository
} from "./createTeacherInvoice.failureInMemoryRepository";

describe('US-6: Envoie d\'une facture', () => {
    test('US-6-AC-1: Envoie réussie', async () => {

        // Etant donné que je suis connecté en tant de professeur
        const mockRepository = new CreateTeacherInvoiceSuccessInMemoryRepository();

        act(() => {
            render(<CreateTeacherInvoiceRepositoryProvider
                createTeacherInvoiceRepository={mockRepository}>
                <CreateTeacherInvoiceComponent/>
            </CreateTeacherInvoiceRepositoryProvider>);
        });

        // Quand j'envoie un montant de 600e et un fichier PDF
        await userEvent.type(screen.getByLabelText(/Montant/i), '600')
        const fileInput = screen.getByLabelText(/Facture PDF/i);
        const file = new File(['test'], 'facture.pdf', { type: 'application/pdf' });
        await userEvent.upload(fileInput, file);

        await act(async () => {
            await userEvent.click(screen.getByRole('button', {name: /Envoyer/i}));
        });

        // Alors une facture contenant : montant, fichier pdf, date de création, professeur (moi) et status 'en attente de validation' doit être créée
        expect(
          await screen.findByText('Facture envoyée avec succès')
        ).toBeInTheDocument();

    })



    test('US-6-AC-2: Envoi échoué, montant inférieur à 0', async () => {

        // Etant donné que je suis connecté en tant que professeur ...
        const mockRepository = new CreateTeacherInvoiceFailureInMemoryRepository();

        act(() => {
            render(
                <CreateTeacherInvoiceRepositoryProvider
                    createTeacherInvoiceRepository={mockRepository}>
                    <CreateTeacherInvoiceComponent/>
                </CreateTeacherInvoiceRepositoryProvider>);
        });

        // Quand j’envoie un montant de -200e et un fichier PDF…
        await userEvent.clear(screen.getByLabelText('Montant'))
        await userEvent.type(screen.getByLabelText('Montant'), '-200');
        const fileInput = screen.getByLabelText(/Facture PDF/i);
        const file = new File(['test'], 'facture.pdf', { type: 'application/pdf' });
        await userEvent.upload(fileInput, file);

        await act(async () => {
            await userEvent.click(screen.getByRole('button', {name: /Envoyer/i}));
        });

        // Alors une erreur "le montant de la facture doit être supérieur à 0" doit être envoyée
        expect(
          await screen.findByText('Erreur: Le montant de la facture doit être supérieur à 0')
        ).toBeInTheDocument();
    });

})

