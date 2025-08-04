import {describe, expect, test, vi} from "vitest";
import {render, waitFor, screen, act} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ValidateInvoiceRepositoryProvider } from "../validateInvoice.invoice.repository.provider";
import { ValidateInvoiceComponent } from "../ValidateInvoice.component";
import { ValidateInvoiceSuccessInMemoryRepository } from "./validateInvoice.invoice.successInMemoryRepository";
import { ValidateInvoiceFailureInMemoryRepository } from "./validateInvoice.invoice.failureInMemoryRepository";


describe('US-9: Validation de la facture', async () => {
  
    test('US-9-AC-1: Validation réussie', async () => {

        // Etant donné que je suis connecté en tant que responsable financier et que le professeur David Robert a une facture de 600e avec un id de 1

        // Quand je veux valider la facture 1, si tout se passe bien
        render(<ValidateInvoiceRepositoryProvider
            validateInvoiceRepository={new ValidateInvoiceSuccessInMemoryRepository()}>
            <ValidateInvoiceComponent invoiceId={1}/>
        </ValidateInvoiceRepositoryProvider>);

        const validateButton = screen.getByTestId('validate-invoice-button');
        
        await act(async () => {
          await userEvent.click(validateButton);
        });

        // Alors la facture doit avoir le status "validé" et une date de validation
        expect(
          await screen.findByText('Facture validée')
        ).toBeInTheDocument();
        
    })

    test('US-9-AC-4: Validation échouée : utilisateur pas responsable financier', async () => {

        // Etant donné que je suis connecté en tant que professeur et que le professeur David Robert et que le professeur a une facture de 600e avec un id de 1

        // Quand je veux valider la facture 1
        render(<ValidateInvoiceRepositoryProvider
            validateInvoiceRepository={new ValidateInvoiceFailureInMemoryRepository()}>
            <ValidateInvoiceComponent invoiceId={1}/>
        </ValidateInvoiceRepositoryProvider>);

        const validateButton = screen.getByTestId('validate-invoice-button');
        
        await act(async () => {
          await userEvent.click(validateButton);
        });

        // Alors je dois recevoir une erreur "Vous ne pouvez pas effectuer cette opération"
        expect(
          await screen.findByText('Vous ne pouvez pas effectuer cette opération')
        ).toBeInTheDocument();

    })

})