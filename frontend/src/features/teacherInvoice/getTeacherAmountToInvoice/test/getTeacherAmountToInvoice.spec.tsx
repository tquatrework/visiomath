import {render, waitFor, screen} from "@testing-library/react";
import { GetTeacherAmountToInvoiceProvider } from "../getTeacherAmountToInvoice.repository.provider";
import GetTeacherAmountToInvoiceComponent from "../GetTeacherAmountToInvoiceComponent";
import { GetTeacherAmountToInvoiceSuccessInMemoryRepository } from "./getTeacherAmountToInvoice.successInMemoryRepository";

describe('#US-4: Affichage du solde à facturer du professeur', () => {

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

})
