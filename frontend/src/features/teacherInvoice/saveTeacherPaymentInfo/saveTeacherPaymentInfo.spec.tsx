import {beforeEach, describe, expect, MockInstance, test, vi} from "vitest";
import TeacherPaymentInfoForm from "@src/features/teacherInvoice/saveTeacherPaymentInfo/TeacherPaymentInfoForm";
import {render, waitFor, screen} from "@testing-library/react";
import userEvent from '@testing-library/user-event'
import {
    SaveTeacherPaymentInfoRepositoryProvider
} from "@src/features/teacherInvoice/saveTeacherPaymentInfo/saveTeacherPaymentInfo.repository.provider";
import {
    TeacherPaymentInfoInMemoryRepository
} from "@src/features/teacherInvoice/saveTeacherPaymentInfo/saveTeacherPaymentInfo.inMemoryRepository";


describe('#US-1: Enregistrement des informations personnelles / de paiement du professeur', async () => {

    let alertSpy: MockInstance;

    beforeEach(() => {
        alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {
        })

        render(<SaveTeacherPaymentInfoRepositoryProvider
            saveTeacherPaymentInfoRepository={new TeacherPaymentInfoInMemoryRepository()}>
            <TeacherPaymentInfoForm/>
        </SaveTeacherPaymentInfoRepositoryProvider>);
    })

    test('#US-1-AC-1: Enregistrement réussi avec BIC 6 + 2', async () => {

        // Etant donné que je suis connecté en tant que professeur

        // Quand j’enregistre :
        // Nom de l’entreprise : “ProfCompany”
        await userEvent.type(screen.getByLabelText(/Nom de l'entreprise/i), 'ProfCompany')
        // Siret : “12345678912345
        await userEvent.type(screen.getByLabelText(/Siret/i), '12345678912345')
        // Type entreprise : AE
        await userEvent.selectOptions(screen.getByLabelText(/Type entreprise/i), 'AE')
        // Assujetti TVA : non
        await userEvent.click(screen.getByRole('checkbox', {name: /Assujetti TVA/i}))
        // IBAN : FR 1234567891234567891234567
        await userEvent.type(screen.getByLabelText(/IBAN/i), 'FR1234567891234567891234567')
        // Bic : azertyaz
        await userEvent.type(screen.getByLabelText(/BIC/i), 'azertyaz')

        await userEvent.click(screen.getByRole('button', {name: /Enregistrer/i}),)

        // Alors mon enregistrement doit être confirmé
        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('Enregistrement Ok')
        })

    })

    test('#US-1-AC-2: Enregistrement échoué avec SIRET de moins de 14 caractères', async () => {
        // Etant donné que je suis connecté en tant que professeur

        // Quand j’enregistre :
        // Nom de l’entreprise : "ProfCompany"
        await userEvent.type(screen.getByLabelText(/Nom de l'entreprise/i), 'ProfCompany')
        // Siret : “12345678912345
        await userEvent.type(screen.getByLabelText(/Siret/i), '123456789123')
        // Type entreprise : AE
        await userEvent.selectOptions(screen.getByLabelText(/Type entreprise/i), 'AE')
        // Assujetti TVA : non
        await userEvent.click(screen.getByRole('checkbox', {name: /Assujetti TVA/i}))
        // IBAN : FR 1234567891234567891234567
        await userEvent.type(screen.getByLabelText(/IBAN/i), 'FR1234567891234567891234567')
        // Bic : azertyaz
        await userEvent.type(screen.getByLabelText(/BIC/i), 'azertyaz')

        await userEvent.click(screen.getByRole('button', {name: /Enregistrer/i}),)

        // Alors mon enregistrement doit être refusé
        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('Le SIRET doit contenir 14 caractères')
        })
    })

    test('#US-1-AC-2: Enregistrement échoué avec type d’entreprise "test" qui n’est pas AE, SARL ou SA', async () => {

        // Etant donné que je suis connecté en tant que professeur

        // Quand j’enregistre :
        // Nom de l’entreprise : "ProfCompany"
        await userEvent.type(screen.getByLabelText(/Nom de l'entreprise/i), 'ProfCompany')
        // Siret : “12345678912345
        await userEvent.type(screen.getByLabelText(/Siret/i), '12345678912345')
        // Type entreprise : test
        const select = screen.getByLabelText(/Type entreprise/i) as HTMLSelectElement
        const hackedOption = document.createElement('option')
        hackedOption.value = 'test'
        hackedOption.textContent = 'hack'
        select.appendChild(hackedOption)
        await userEvent.selectOptions(screen.getByLabelText(/Type entreprise/i), 'test')
        // Assujetti TVA : non
        await userEvent.click(screen.getByRole('checkbox', {name: /Assujetti TVA/i}))
        // IBAN : FR 1234567891234567891234567
        await userEvent.type(screen.getByLabelText(/IBAN/i), 'FR1234567891234567891234567')
        // Bic : azertyaz
        await userEvent.type(screen.getByLabelText(/BIC/i), 'azertyaz')

        await userEvent.click(screen.getByRole('button', {name: /Enregistrer/i}),)

        // Alors mon enregistrement doit être refusé
        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('Les informations de paiement du professeur ne sont pas au bon format')
        })



    })

})
