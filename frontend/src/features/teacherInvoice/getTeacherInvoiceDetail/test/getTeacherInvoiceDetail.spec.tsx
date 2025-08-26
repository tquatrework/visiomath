import {describe, expect, test, afterEach} from "vitest";
import {render, screen, act, waitFor} from "@testing-library/react";
import { GetTeacherInvoiceDetailProvider } from '../getTeacherInvoiceDetail.teacherInvoice.repository.provider';
import { GetTeacherInvoiceDetailComponent } from '../GetTeacherInvoiceDetail.component';
import { GetTeacherInvoiceDetailTeacherInvoiceSuccessInMemoryRepository } from './getTeacherInvoiceDetail.teacherInvoice.successInMemoryRepository';
import { GetTeacherInvoiceDetailTeacherInvoiceFailureInMemoryRepository } from './getTeacherInvoiceDetail.teacherInvoice.failureInMemoryRepository';
import {MemoryRouter, Route, Routes} from 'react-router-dom';
import {UserProvider} from "@src/providers/UserContext";
import TeacherInvoiceDetailPage from "@src/features/teacherInvoice/TeacherInvoiceDetail.page";

describe('US-8: Visualisation du détail d\'une facture', async () => {
    
    afterEach(() => {
        localStorage.clear();
    });

    test('US-8-AC-1: Visualisation réussie', async () => {

        // Etant donné que je suis connecté en tant que responsable financier et que le professeur David Robert a une facture de 600e avec un id de 1 et une date d’échéance le 25/12/2027

        // Quand je veux visualiser la facture 1, si tout se passe bien
        render(<GetTeacherInvoiceDetailProvider
            getTeacherInvoiceDetailRepository={new GetTeacherInvoiceDetailTeacherInvoiceSuccessInMemoryRepository()}>
            <GetTeacherInvoiceDetailComponent invoiceId={1}/>
        </GetTeacherInvoiceDetailProvider>);

        // Alors je dois voir les détails de la facture id 1 : id, nom du professeur, montant, date de création, status et une date d’échéance le 25/12/2027 et un lien pour télécharger le PDF
        expect(
          await screen.findByTestId('invoice-id')
        ).toHaveTextContent('1');
        
        expect(
          await screen.findByTestId('invoice-teacher-name')
        ).toHaveTextContent('David Robert');
        
        expect(
          await screen.findByTestId('invoice-amount')
        ).toHaveTextContent('600');
        
        expect(
          await screen.findByTestId('invoice-creation-date')
        ).toHaveTextContent('2024-01-15');
        
        expect(
          await screen.findByTestId('invoice-pdf-download')
        ).toHaveAttribute('href', '/uploads/facture-david-robert.pdf');
        
        expect(
          await screen.findByTestId('invoice-status')
        ).toHaveTextContent('en attente de validation');
        
        expect(
          await screen.findByTestId('invoice-due-date')
        ).toHaveTextContent('25/12/2027');
        
    })

    test('US-8-AC-2: Visualisation échouée : erreur lors de la récupération', async () => {

        // Etant donné que je suis connecté en tant que responsable financier et que le professeur David Robert a une facture de 600e avec un id de 1 et une date d’échéance le 25/12/2027

        // Quand je veux visualiser la facture 1, si la récupération échoue
        render(<GetTeacherInvoiceDetailProvider
            getTeacherInvoiceDetailRepository={new GetTeacherInvoiceDetailTeacherInvoiceFailureInMemoryRepository()}>
            <GetTeacherInvoiceDetailComponent invoiceId={1}/>
        </GetTeacherInvoiceDetailProvider>);

        // Alors je dois recevoir une erreur "la récupération de la facture à échoué"
        expect(
          await screen.findByText('Erreur: la récupération de la facture à échoué')
        ).toBeInTheDocument();

    })

    test('#US-8-AC-4: Visualisation échouée : utilisateur pas responsable financier', async () => {

        // Etant donné que je suis connecté en tant que professeur et que le professeur David Robert a une facture de 600e avec un id de 1
        localStorage.setItem('access_token', 'fake-token');
        localStorage.setItem('user_info', JSON.stringify({
            id: 1,
            role: ['teacher']
        }));



        // Quand je veux visualiser la facture 1
        act(() => {
            render(
                <MemoryRouter  initialEntries={['/teacher-facturation/invoice/1']}>
                    <UserProvider>
                        <Routes>
                            <Route path="/teacher-facturation/invoice/:id" element={<TeacherInvoiceDetailPage />} />
                        </Routes>
                    </UserProvider>
                </MemoryRouter>
            );
        });

        //Alors je ne peux pas voir la facture
        expect(screen.queryByTestId('teacher-invoice-details-title')).not.toBeInTheDocument();


    })


})