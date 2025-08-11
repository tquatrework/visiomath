import React from 'react';
import {describe, expect, test} from "vitest";
import {render, screen, act} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RefuseInvoiceProvider } from '../refuseInvoice.invoice.repository.provider';
import { RefuseInvoiceComponent } from '../RefuseInvoice.component';
import { RefuseInvoiceSuccessInMemoryRepository, RefuseInvoiceUnauthorizedInMemoryRepository } from './refuseInvoice.invoice.inMemoryRepositories';


describe('US-10: Refus de la facture', async () => {
  
    test('US-10-AC-1: Refus réussie', async () => {

        // Etant donné que je suis connecté en tant que responsable financier et que le professeur David Robert a une facture de 600e avec un id de 1
        render(<RefuseInvoiceProvider
            refuseInvoiceRepository={new RefuseInvoiceSuccessInMemoryRepository()}>
            <RefuseInvoiceComponent invoiceId={1} />
        </RefuseInvoiceProvider>);

        // Quand je veux refuser la facture 1 avec en raison "mauvais format de la facture : png" si tout se passe bien
        const refusalReasonTextarea = screen.getByRole('textbox', { name: 'Motif de refus' });
        await userEvent.type(refusalReasonTextarea, 'mauvais format de la facture : png');
        
        const refuseButton = screen.getByRole('button', { name: 'Refuser la facture' });
        await act(async () => {
          await userEvent.click(refuseButton);
        });

        // Alors  la facture doit avoir le status "refusée" et une date de refus
        expect(
          await screen.findByTestId('refusal-success-message')
        ).toHaveTextContent('La facture a été refusée avec succès');
        
    })

    test('US-10-AC-5: refus échoué : utilisateur pas responsable financier', async () => {

        // Etant donné que je suis connecté en tant que professeur et que le professeur David Robert et que le professeur a une facture de 600e avec un id de 1
        render(<RefuseInvoiceProvider
            refuseInvoiceRepository={new RefuseInvoiceUnauthorizedInMemoryRepository()}>
            <RefuseInvoiceComponent invoiceId={1} />
        </RefuseInvoiceProvider>);

        // Quand je veux refuser la facture 1 avec en raison "mauvais format de la facture : png"
        const refusalReasonTextarea = screen.getByRole('textbox', { name: 'Motif de refus' });
        await userEvent.type(refusalReasonTextarea, 'mauvais format de la facture : png');
        
        const refuseButton = screen.getByRole('button', { name: 'Refuser la facture' });
        await act(async () => {
          await userEvent.click(refuseButton);
        });

        // Alors je dois recevoir une erreur "Vous ne pouvez pas effectuer cette opération"
        expect(
          await screen.findByTestId('refusal-error-message')
        ).toHaveTextContent('Vous ne pouvez pas effectuer cette opération');

    })


})