import {describe, expect, test} from "vitest";
import {render, screen} from "@testing-library/react";
import { GetTeacherInvoicesProvider } from '../getTeacherInvoices.repository.provider';
import { GetTeacherInvoicesComponent } from '../GetTeacherInvoices.component';
import { GetTeacherInvoicesSuccessInMemoryRepository } from './getTeacherInvoices.successInMemoryRepository';

describe('US-7: Visualisation de la facture', async () => {


    test('US-7-AC-1: Visualisation réussie', async () => {

        // Etant donné que je suis connecté en tant que responsable financier et que le professeur David Robert a une facture de 600e avec un id de 1

        // Quand je veux visualiser toutes les factures, si tout se passe bien
        render(<GetTeacherInvoicesProvider
            getTeacherInvoicesRepository={new GetTeacherInvoicesSuccessInMemoryRepository()}>
            <GetTeacherInvoicesComponent/>
        </GetTeacherInvoicesProvider>);

        // Alors je dois voir la facture id 1 à 600e de David Robert dans le tableau
        const invoiceRow = await screen.findByTestId('teacher-invoice-1');
        expect(invoiceRow).toHaveTextContent('David Robert');
        expect(invoiceRow).toHaveTextContent('600€');
        expect(invoiceRow).toHaveTextContent('en attente de validation');
        expect(invoiceRow).toHaveTextContent('01/01/2024');
        expect(invoiceRow).toHaveTextContent('Voir la facture');

    })

})