import {describe, expect, test} from "vitest";
import {render, screen, act} from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { PayInvoiceComponent } from '../PayInvoice.component';
import { PayInvoiceInvoiceProvider } from '../payInvoice.invoice.repository.provider';
import { 
    PayInvoiceInvoiceSuccessInMemoryRepository, 
    PayInvoiceInvoiceUnauthorizedInMemoryRepository 
} from './payInvoice.invoice.inMemoryRepositories';
import {MemoryRouter, Route, Routes} from "react-router-dom";
import {UserProvider} from "@src/providers/UserContext";
import TeacherInvoiceDetailPage from "@src/features/teacherInvoice/TeacherInvoiceDetail.page";
import React from "react";


describe('US-11: Paiement de la facture', async () => {
  
    test('US-11-AC-1: Paiement réussi', async () => {

        // Étant donné que je suis connecté en tant que responsable financier et que le professeur David Robert a une facture de 600 € avec un id de 1
        const invoiceId = 1;

        // Quand je veux payer la facture 1
        render(<PayInvoiceInvoiceProvider
            invoiceRepository={new PayInvoiceInvoiceSuccessInMemoryRepository()}>
            <PayInvoiceComponent invoiceId={invoiceId}/>
        </PayInvoiceInvoiceProvider>);

        const payButton = screen.getByTestId('pay-invoice-button');
        await act(async () => {
            await userEvent.click(payButton);
        });

        // Alors la facture doit avoir le statut "payée" et une date de paiement doit être enregistrée, et le solde du professeur doit être diminué du montant correspondant

        expect(
          await screen.findByTestId('payment-confirmation-message')
        ).toHaveTextContent('Facture payée avec succès');
        
    })

    test('US-11-AC-5: Paiement échoué — utilisateur pas responsable financier', async () => {

        // Étant donné que je suis connecté en tant que professeur et que le professeur David Robert a une facture de 600 € avec un id de 1
        const invoiceId = 1;

        // Quand je veux payer la facture 1
        render(<PayInvoiceInvoiceProvider
            invoiceRepository={new PayInvoiceInvoiceUnauthorizedInMemoryRepository()}>
            <PayInvoiceComponent invoiceId={invoiceId}/>
        </PayInvoiceInvoiceProvider>);

        const payButton = screen.getByTestId('pay-invoice-button');
        await act(async () => {
            await userEvent.click(payButton);
        });

        // Alors je dois recevoir une erreur "Vous ne pouvez pas effectuer cette opération"
        expect(
          await screen.findByTestId('payment-error-message')
        ).toHaveTextContent('Vous ne pouvez pas effectuer cette opération');

    })

    test('#US-11-AC-5: Paiement échoué : utilisateur pas responsable financier', async () => {

        // Etant donné que je suis connecté en tant que professeur et que le professeur David Robert et que le professeur a une facture avec un id de 1
        localStorage.setItem('access_token', 'fake-token');
        localStorage.setItem('user_info', JSON.stringify({
            id: 1,
            role: ['teacher']
        }));

        // Quand je veux valider la facture 1
        act(() => {
            render(
                <MemoryRouter initialEntries={['/teacher-facturation/invoice/1']}>
                    <UserProvider>
                        <Routes>
                            <Route path="/teacher-facturation/invoice/:id" element={<TeacherInvoiceDetailPage />} />
                        </Routes>
                    </UserProvider>
                </MemoryRouter>
            );
        });

        //Alors je ne peux pas valider la facture
        expect(screen.queryByTestId('teacher-invoice-details-title')).not.toBeInTheDocument();


    })

})