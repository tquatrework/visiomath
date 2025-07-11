import {beforeEach, describe, expect, MockInstance, test, vi} from "vitest";
import TeacherPaymentInfoForm from "@src/features/{module}/{userStory2}/TeacherPaymentInfoForm";
import {render, waitFor, screen, act} from "@testing-library/react";
import userEvent from '@testing-library/user-event'
import {
    {userStory2}RepositoryProvider
} from "@src/features/{module}/{userStory2}/{userStory2}.repository.provider";
import {
    {userStory2}SuccessInMemoryRepository
} from "@src/features/{module}/{userStory2}/{userStory2}.successInMemoryRepository";
import {
    {userStory2}FailureInMemoryRepository
} from "@src/features/{module}/{userStory2}/{userStory2}.failureInMemoryRepository";


describe('#US-1: Enregistrement des informations personnelles / de paiement du professeur', async () => {

    let alertSpy: MockInstance;

    beforeEach(() => {
        alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    })

    describe('#US-1-AC-1: Enregistrement réussi', async () => {

        test('#US-1-AC-1: Enregistrement réussi avec BIC 6 + 2', async () => {

            // Etant donné que je suis connecté en tant que professeur
            act(() => {
                render(<{userStory2}RepositoryProvider
                    {userStory2}Repository={new {userStory2}SuccessInMemoryRepository()}>
                    <TeacherPaymentInfoForm/>
                </{userStory2}RepositoryProvider>);
            });

            // Quand j'enregistre :
            // Nom de l'entreprise : "ProfCompany"
            await userEvent.type(screen.getByLabelText(/Nom de l'entreprise/i), 'ProfCompany')
            // Siret : "12345678912345
            await userEvent.type(screen.getByLabelText(/Siret/i), '12345678912345')
            // Type entreprise : Autoentrepreneur
            await userEvent.selectOptions(screen.getByLabelText(/Type entreprise/i), 'Autoentrepreneur')
            // Assujetti TVA : non
            await userEvent.click(screen.getByRole('checkbox', {name: /Assujetti TVA/i}))
            // IBAN : FR 1234567891234567891234567
            await userEvent.type(screen.getByLabelText(/IBAN/i), 'FR1234567891234567891234567')
            // Bic : azertyaz
            await userEvent.type(screen.getByLabelText(/BIC/i), 'azertyaz')

            await act(async () => {
                await userEvent.click(screen.getByRole('button', {name: /Sauvegarder/i}));
            });

            // Alors mon enregistrement doit être confirmé
            await waitFor(() => {
                expect(alertSpy).toHaveBeenCalledWith('Enregistrement Ok')
            })

        })
    })

    describe('#US-1-AC-2: Enregistrement échoué', async () => {

        test('#US-1-AC-2: Enregistrement échoué avec SIRET de moins de 14 caractères', async () => {

            // Etant donné que je suis connecté en tant que professeur
            act(() => {
                render(<{userStory2}RepositoryProvider
                    {userStory2}Repository={new {userStory2}FailureInMemoryRepository()}>
                    <TeacherPaymentInfoForm/>
                </{userStory2}RepositoryProvider>);
            });

            // Quand j'enregistre mes infos avec un siret de moins de 14 caractères
            // Nom de l'entreprise : "ProfCompany"
            await userEvent.type(screen.getByLabelText(/Nom de l'entreprise/i), 'ProfCompany')
            // Siret : "123456789123" (moins de 14 caractères)
            await userEvent.type(screen.getByLabelText(/Siret/i), '123456789123')
            // Type entreprise : Autoentrepreneur
            await userEvent.selectOptions(screen.getByLabelText(/Type entreprise/i), 'Autoentrepreneur')
            // Assujetti TVA : non
            await userEvent.click(screen.getByRole('checkbox', {name: /Assujetti TVA/i}))
            // IBAN : FR 1234567891234567891234567
            await userEvent.type(screen.getByLabelText(/IBAN/i), 'FR1234567891234567891234567')
            // Bic : azertyaz
            await userEvent.type(screen.getByLabelText(/BIC/i), 'azertyaz')

            await act(async () => {
                await userEvent.click(screen.getByRole('button', {name: /Sauvegarder/i}));
            });

            // Alors mon enregistrement doit renvoyer une erreur "Le SIRET doit contenir 14 caractères"
            await waitFor(() => {
                expect(alertSpy).toHaveBeenCalledWith('Le SIRET doit contenir 14 caractères')
            })

        })
    })

})
